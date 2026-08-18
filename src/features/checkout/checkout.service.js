/**
 * -----------------------------------------------------------------------------
 * Checkout Service
 * -----------------------------------------------------------------------------
 *
 * Coordinates the complete checkout workflow.
 *
 * Responsibilities:
 * - Validate incoming request
 * - Load product details
 * - Process payment
 * - Persist order
 * - Return checkout response
 *
 * NOTE:
 * This service intentionally acts as an orchestrator.
 * Each business operation is delegated to the appropriate service.
 *
 * In upcoming sessions, this service will be instrumented using
 * OpenTelemetry to generate traces, metrics, and logs.
 * -----------------------------------------------------------------------------
 */

import { fetchProducts } from "../products/products.service.js";
import { processPayment } from "./payment.service.js";
import { saveOrder } from "./database.service.js";

import { withSpan } from "../../platform/observability/tracing/tracing.js";
import { checkoutRequests } from "../../platform/observability/metrics/metrics.js";
import {
    checkoutRequestDuration
} from "../../platform/observability/metrics/metrics.js";
import { performance } from "node:perf_hooks";

/**
 * Process customer checkout.
 *
 * @param {Object} checkoutRequest
 * @returns {Promise<Object>}
 */
export async function processCheckout(checkoutRequest) {
    const start = performance.now();
    checkoutRequests.add(1);

    try { 
        validateCheckoutRequest(checkoutRequest);
        const products = await withSpan(
            "Fetch Products",
            () => fetchProducts(checkoutRequest.productIds)
        );

        const payment = await withSpan(
            "Process Payment",
            {
                "customer.id": checkoutRequest.customerId,
                "product.count": products.length
            },
            async (span) => {
                const p = await processPayment(products);
                // set dynamic attributes only known after payment completes
                if (p?.amount) span.setAttribute("payment.amount", p.amount);
                if (checkoutRequest.paymentMethod) span.setAttribute("payment.method", checkoutRequest.paymentMethod);
                return p;
            }
        );

        const order = await withSpan(
            "Save Order",
            async (span) => {
                const o = await saveOrder({
                    customerId: checkoutRequest.customerId,
                    products,
                    payment
                });
                if (o?.orderId) span.setAttribute("order.id", o.orderId);
                return o;
            }
        );

        return {
            success: true,
            orderId: order.orderId,
            transactionId: payment.transactionId,
            message: "Order placed successfully."
        };
    }
     finally {
        const duration = performance.now() - start;
        checkoutRequestDuration.record(duration);
    }

}

/**
 * Validates checkout request.
 *
 * @param {Object} checkoutRequest
 */
function validateCheckoutRequest(checkoutRequest) {

    if (!checkoutRequest.customerId) {
        throw new Error("Customer Id is required.");
    }

    if (!checkoutRequest.productIds?.length) {
        throw new Error("At least one product is required.");
    }

    if (!checkoutRequest.paymentMethod) {
        throw new Error("Payment method is required.");
    }

}
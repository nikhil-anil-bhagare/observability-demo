import {
    delay,
    randomLatency,
    shouldFail
} from "../../shared/utils/failure-simulator.js";
import { logger } from "../../platform/observability/logging/logger.js";

/**
 * Process customer payment.
 *
 * @param {Array} products
 * @returns {Promise<Object>}
 */
export async function processPayment(products) {

    logger.info({
        productCount: products.length
    }, "Payment processing started.");

    logger.info("Calling payment gateway.");

    // Simulate network latency
    const latency = randomLatency();

    if (latency >= 4000) {
        logger.warn({
            latency
        }, "Payment gateway is responding slowly.");
    }

    await delay(latency);

    // Simulate payment gateway failure
    if (shouldFail(20)) {

        logger.error({
            latency
        }, "Payment gateway timeout.");

        throw new Error("Payment gateway timeout.");
    }

    const amount = products.reduce(
        (total, product) => total + product.price,
        0
    );

    const transactionId = generateTransactionId();

    logger.info({
        transactionId,
        amount
    }, "Payment processed successfully.");

    return {
        transactionId,
        amount,
        status: "SUCCESS"
    };

}

/**
 * Generates a mock transaction ID.
 */
function generateTransactionId() {
    return `TXN-${Date.now()}`;
}
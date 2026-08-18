/**
 * -----------------------------------------------------------------------------
 * Database Service
 * -----------------------------------------------------------------------------
 *
 * Simulates persisting an order in the database.
 *
 * Responsibilities:
 * - Simulate database latency
 * - Randomly simulate database timeout
 * - Return generated Order ID
 *
 * This service will later be instrumented using:
 * - OpenTelemetry Traces
 * - Metrics
 * - Structured Logs
 * -----------------------------------------------------------------------------
 */

import {
    delay,
    randomLatency,
    shouldFail
} from "../../shared/utils/failure-simulator.js";

/**
 * Save customer order.
 *
 * @param {Object} order
 * @returns {Promise<Object>}
 */
export async function saveOrder(order) {

    // Simulate database processing time
    await delay(randomLatency());

    // Simulate database timeout
    if (shouldFail(10)) {
        throw new Error("Database connection timeout.");
    }

    return {
        orderId: generateOrderId(),
        status: "SAVED"
    };

}

/**
 * Generates a mock Order ID.
 */
function generateOrderId() {
    return `ORD-${Date.now()}`;
}
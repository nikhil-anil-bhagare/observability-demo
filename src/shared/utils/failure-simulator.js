/**
 * -----------------------------------------------------------------------------
 * Failure Simulator
 * -----------------------------------------------------------------------------
 *
 * Simulates real production behaviour such as:
 *
 * - Random network latency
 * - Payment gateway failures
 * - Database timeouts
 *
 * The goal is NOT to simulate a real payment gateway,
 * but to create realistic scenarios for demonstrating
 * Observability concepts.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Pause execution for the specified duration.
 *
 * @param {number} milliseconds
 */
export async function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Returns a random latency.
 *
 * Distribution:
 *
 * 70% -> Fast (100-300 ms)
 * 20% -> Slow (1000-2000 ms)
 * 10% -> Very Slow (4000-6000 ms)
 */
export function randomLatency() {

    const random = Math.random();

    if (random < 0.70) {
        return randomBetween(100, 300);
    }

    if (random < 0.90) {
        return randomBetween(1000, 2000);
    }

    return randomBetween(4000, 6000);

}

/**
 * Returns true based on the supplied probability.
 *
 * Example:
 *
 * shouldFail(20)
 *
 * returns true approximately 20% of the time.
 *
 * @param {number} percentage
 */
export function shouldFail(percentage = 20) {
    return Math.random() * 100 < percentage;
}

/**
 * Generates a random integer between min and max.
 */
function randomBetween(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}
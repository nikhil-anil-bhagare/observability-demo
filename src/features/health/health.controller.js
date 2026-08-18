/**
 * -----------------------------------------------------------------------------
 * Health Controller
 * -----------------------------------------------------------------------------
 *
 * Provides a simple health endpoint.
 *
 * This endpoint is intentionally lightweight and is commonly used by
 * load balancers, orchestrators (e.g. Kubernetes) and monitoring systems
 * to verify that the application is running.
 * -----------------------------------------------------------------------------
 */

export function health(req, res) {
    res.json({
        status: 'UP',
        application: process.env.APPLICATION_NAME,
        version: process.env.APPLICATION_VERSION
    });
}
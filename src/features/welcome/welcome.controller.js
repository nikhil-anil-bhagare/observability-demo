/**
 * Welcome endpoint.
 *
 * Used only for demonstration purposes.
 */

export function welcome(req, res) {
    res.json({
        message: 'Welcome to Observability Demo'
    });
}
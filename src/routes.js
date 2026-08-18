/**
 * -----------------------------------------------------------------------------
 * Route Registration
 * -----------------------------------------------------------------------------
 *
 * Central place for registering all application routes.
 *
 * Every feature owns its own router.
 * The application simply mounts those routers here.
 *
 * This keeps app.js clean and allows features to evolve independently.
 * -----------------------------------------------------------------------------
 */

import healthRoutes from './features/health/health.routes.js';
import welcomeRoutes from './features/welcome/welcome.routes.js';
import productRoutes from './features/products/products.routes.js';
import checkoutRoutes from './features/checkout/checkout.routes.js';

export default function registerRoutes(app) {
    app.use('/', healthRoutes);
    app.use('/welcome', welcomeRoutes);
    app.use('/products', productRoutes);
    app.use('/checkout', checkoutRoutes);
}
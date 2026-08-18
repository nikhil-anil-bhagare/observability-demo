/**
 * -----------------------------------------------------------------------------
 * Application Entry Point
 * -----------------------------------------------------------------------------
 *
 * Bootstraps the Express application.
 *
 * Responsibilities:
 * - Load environment variables.
 * - Create the Express application.
 * - Register global middleware.
 * - Register application routes.
 * - Start the HTTP server.
 *
 * NOTE:
 * This file should remain very small.
 * Business logic should never be added here.
 * -----------------------------------------------------------------------------
 */

import dotenv from 'dotenv';
import express from 'express';
import registerRoutes from './routes.js';

dotenv.config();

const app = express();

app.use(express.json());

registerRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`---${process.env.APPLICATION_NAME} started on port ${PORT}---`);
});
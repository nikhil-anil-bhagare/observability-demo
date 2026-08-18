/**
 * Checkout Controller
 *
 * Handles checkout requests.
 */

import { processCheckout } from "./checkout.service.js";
import { checkoutErrors } from "../../platform/observability/metrics/metrics.js";

export async function checkout(req, res) {

    try {

        const result = await processCheckout(req.body);

        res.status(200).json(result);

    } catch (error) {
        checkoutErrors.add(1);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
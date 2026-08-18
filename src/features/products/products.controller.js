/**
 * -----------------------------------------------------------------------------
 * Product Controller
 * -----------------------------------------------------------------------------
 *
 * Handles incoming HTTP requests for products.
 *
 * Delegates business logic to Product Service.
 * -----------------------------------------------------------------------------
 */

import { fetchProducts } from "./products.service.js";

export async function getProducts(req, res) {

    const products = await fetchProducts([1, 2, 3, 4]);

    res.json(products);

}
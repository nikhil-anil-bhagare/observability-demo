/**
 * -----------------------------------------------------------------------------
 * Product Service
 * -----------------------------------------------------------------------------
 *
 * Simulates fetching product information from a database.
 *
 * In a real application this service would:
 *
 * - Query a relational database
 * - Call another microservice
 * - Read from cache
 *
 * For this demo we return mock data while keeping
 * the structure close to a production implementation.
 * -----------------------------------------------------------------------------
 */

/**
 * Mock product catalogue.
 */
const PRODUCTS = [
    {
        id: 1,
        name: "Wireless Mouse",
        price: 999
    },
    {
        id: 2,
        name: "Mechanical Keyboard",
        price: 2999
    },
    {
        id: 3,
        name: "USB-C Hub",
        price: 1999
    },
    {
        id: 4,
        name: "Laptop Stand",
        price: 1499
    }
];

/**
 * Fetch products by their IDs.
 *
 * @param {number[]} productIds
 * @returns {Promise<Array>}
 */
export async function fetchProducts(productIds) {

    return PRODUCTS.filter(product =>
        productIds.includes(product.id)
    );

}
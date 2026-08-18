/**
 * -----------------------------------------------------------------------------
 * Tracing Utility
 * -----------------------------------------------------------------------------
 *
 * Provides reusable helpers for instrumenting business operations using
 * OpenTelemetry.
 *
 * Why this utility?
 *
 * Instead of duplicating span creation logic throughout the application,
 * this helper centralizes the common tracing workflow.
 *
 * Responsibilities:
 * - Create a span
 * - Execute the business operation
 * - Record exceptions
 * - Set span status
 * - Close the span
 *
 * Example:
 *
 * await withSpan("Process Payment", () => processPayment(products));
 *
 * -----------------------------------------------------------------------------
 */

import { trace, SpanStatusCode } from "@opentelemetry/api";

/**
 * Tracer used for creating manual business spans.
 *
 * The tracer name identifies the instrumentation library responsible
 * for creating the span. It is NOT the application or service name.
 */
const tracer = trace.getTracer("business-tracing");

/**
 * Executes a business operation within a new OpenTelemetry span.
 *
 * The span automatically becomes the active span for the duration of
 * the supplied callback, allowing nested spans to inherit the current
 * trace context.
 *
 * @template T
 * @param {string} spanName Human-readable business operation name.
 * @param {(span: import('@opentelemetry/api').Span) => Promise<T>} operation Business operation to execute. The operation will be invoked with the active `span` so
 * callers can set attributes dynamically (e.g. `span.setAttribute('payment.amount', amt)`).
 * @returns {Promise<T>}
 */
export async function withSpan(spanName, maybeAttrsOrOp, maybeOp) {

    // Normalize arguments: support withSpan(name, operation) and
    // withSpan(name, attributes, operation)
    let attributes;
    let operation;

    if (typeof maybeAttrsOrOp === "function") {
        operation = maybeAttrsOrOp;
    } else {
        attributes = maybeAttrsOrOp;
        operation = maybeOp;
    }

    return tracer.startActiveSpan(spanName, async (span) => {

        try {

            console.log(`withSpan: start ${spanName}`);

            if (attributes && typeof span.setAttributes === "function") {
                span.setAttributes(attributes);
            }

            // Pass the active span to the operation so callers can set
            // dynamic attributes (for values only known during/after execution).
            const result = await operation(span);

            span.setStatus({
                code: SpanStatusCode.OK
            });

            return result;

        } catch (error) {

            span.recordException(error);

            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });

            throw error;

        } finally {

            span.end();
            console.log(`withSpan: end ${spanName}`);

        }

    });

}
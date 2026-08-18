/**
 * -----------------------------------------------------------------------------
 * Logger
 * -----------------------------------------------------------------------------
 *
 * Centralized structured logger.
 *
 * Responsibilities:
 * - Produce JSON logs
 * - Automatically enrich logs with Trace ID and Span ID
 * - Keep business code free from observability concerns
 * -----------------------------------------------------------------------------
 */

import pino from "pino";
import { trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const destination = pino.destination({
    dest: "./logs/application.log",
    sync: false
});

const otelLogger = logs.getLogger(process.env.APPLICATION_NAME ?? "app");

// pino level -> OTel severity
const SEVERITY = {
    10: [SeverityNumber.TRACE, "TRACE"],
    20: [SeverityNumber.DEBUG, "DEBUG"],
    30: [SeverityNumber.INFO, "INFO"],
    40: [SeverityNumber.WARN, "WARN"],
    50: [SeverityNumber.ERROR, "ERROR"],
    60: [SeverityNumber.FATAL, "FATAL"]
};

/**
 * Forwards every pino line to the OpenTelemetry Logs API, which the SDK
 * exports over OTLP to the collector.
 *
 * Emitting here (rather than tailing the log file) keeps the message as the
 * log body and everything else as attributes, and picks up the active span so
 * records carry trace context.
 */
const otelStream = {
    write(line) {

        let record;

        try {
            record = JSON.parse(line);
        } catch {
            return;
        }

        const { level, time, msg, ...attributes } = record;
        const [severityNumber, severityText] = SEVERITY[level] ?? SEVERITY[30];

        otelLogger.emit({
            severityNumber,
            severityText,
            body: msg,
            timestamp: time ? new Date(time) : new Date(),
            attributes
        });

    }
};

export const logger = pino(
    {
        level: process.env.LOG_LEVEL ?? "info",

        timestamp: pino.stdTimeFunctions.isoTime,

        base: {
            service: process.env.APPLICATION_NAME
        },

        mixin() {

            const span = trace.getActiveSpan();

            if (!span) {
                return {};
            }

            const context = span.spanContext();

            return {
                traceId: context.traceId,
                spanId: context.spanId
            };

        }

    },
    // Keep writing the file for local inspection, and ship over OTLP.
    pino.multistream([
        { level: "trace", stream: destination },
        { level: "trace", stream: otelStream }
    ])
);
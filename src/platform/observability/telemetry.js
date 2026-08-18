/**
 * -----------------------------------------------------------------------------
 * OpenTelemetry Bootstrap
 * -----------------------------------------------------------------------------
 *
 * Bootstraps the OpenTelemetry Node SDK.
 *
 * Responsibilities:
 * - Initialize OpenTelemetry
 * - Register automatic instrumentations
 * - Start telemetry collection
 *
 * NOTE:
 * This file must be loaded BEFORE the Express application starts.
 * -----------------------------------------------------------------------------
 */

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import dotenv from "dotenv";

// Load environment variables from .env (if present)
dotenv.config();

import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

import {
    OTLPTraceExporter
} from "@opentelemetry/exporter-trace-otlp-http";

import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";


// The OTel Collector's OTLP/HTTP receiver. Published on the host as 14318
// because Tempo already owns 4318.
const otlpEndpoint =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:14318";

const traceExporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`
});

const metricExporter = new OTLPMetricExporter({
    url: `${otlpEndpoint}/v1/metrics`
});

const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000
});

// Logs are shipped straight to the collector over OTLP. The pino
// auto-instrumentation bridges every logger.* call into a log record, so no
// file tailing is involved.
const logExporter = new OTLPLogExporter({
    url: `${otlpEndpoint}/v1/logs`
});

// OpenTelemetry runtime for application.
const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: process.env.APPLICATION_NAME || "observability-demo"
    }),
    spanProcessors: [
        new BatchSpanProcessor(traceExporter)
    ],
    metricReader,
    logRecordProcessors: [
        new BatchLogRecordProcessor({ exporter: logExporter })
    ],
    instrumentations: [
        getNodeAutoInstrumentations()
    ]
});

sdk.start();

const resolvedServiceName = process.env.APPLICATION_NAME || "observability-demo";
console.log(`-----OpenTelemetry initialized. ------ service.name=${resolvedServiceName}`);
import { metrics } from "@opentelemetry/api";

export const meter = metrics.getMeter("checkout-service");

export const checkoutRequests = meter.createCounter(
    "checkout_requests_total",
    {
        description: "Total number of checkout requests."
    }
);

export const checkoutErrors = meter.createCounter(
    "checkout_errors_total",
    {
        description: "Total number of failed checkout requests."
    }
);

export const checkoutRequestDuration = meter.createHistogram(
    "checkout_request_duration",
    {
        description: "Duration of checkout requests.",
        unit: "ms"
    }
);
Title: Decide the Nginx response-cache policy
Type: grilling
Status: open
Blocked by: 06

## Question

Does staging evidence and the desired content-freshness/resilience model justify adding an Nginx response cache, or should production initially rely only on Craft's warm GraphQL layer?

Consider p95 TTFB above 500 ms, problematic CMS load, desired per-route freshness windows, first-request population, background refresh, and stale-on-error behavior during a Craft outage. If caching is justified, specify a minimal public `GET`/`HEAD` policy with route-level TTLs and bypasses for preview, authorization and relevant cookies; otherwise record why cache complexity should remain deferred.

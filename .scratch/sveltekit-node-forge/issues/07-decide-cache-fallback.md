Title: Decide whether the Nginx cache fallback is needed
Type: grilling
Status: open
Blocked by: 06

## Question

Does staging evidence justify adding an Nginx microcache, or should production initially rely only on Craft's warm GraphQL layer?

Use the standing trigger of p95 TTFB above 500 ms or problematic CMS load. If caching is justified, specify a minimal public `GET`/`HEAD` policy with a short TTL, stale behavior, and bypasses for preview, authorization and relevant cookies; otherwise record why cache complexity should remain deferred.

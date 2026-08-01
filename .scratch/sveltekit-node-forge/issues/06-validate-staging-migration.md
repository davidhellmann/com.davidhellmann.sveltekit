Title: Validate the migration on Forge staging
Type: task
Status: open
Blocked by: 01, 04, 05

## Question

Run the implemented migration on the dedicated Forge staging site and collect the evidence needed for the production decision.

Confirm repeated deployments below 10 minutes; verify the agreed prerender/SSR route matrix, direct loads, assets, redirects, canonicals, 404s and CMS freshness; test Supervisor restart, failed-start handling, healthcheck, and rollback; and measure representative cold/warm response behavior plus p95 TTFB and CMS load. Record exact URLs, commands, timings, and failures as the answer.

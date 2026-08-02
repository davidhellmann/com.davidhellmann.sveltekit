Title: Specify the request-time Craft data-access contract
Type: grilling
Status: open
Blocked by: 01

## Question

How should each SSR route query Craft after the unbounded process-local cache is removed?

Specify which routes can use direct entry-by-slug or paginated GraphQL queries, which aggregated routes genuinely require complete collections, and how Home's random Work/Photo selections should behave. Avoid replacing the removed cache with full-collection fetches on every request by accident. Craft's GraphQL cache is the initial cache boundary; do not implement a new Node cache in this decision.

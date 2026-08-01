Title: Specify the prerender and SSR boundary
Type: grilling
Status: open
Blocked by:

## Question

What is the exact route-by-route rendering contract after the migration?

Turn the standing preference—fixed top-level pages plus the first two pages of every paginated archive are prerendered, later archive pages and all detail pages are SSR—into an exhaustive route matrix. Resolve taxonomy archives, optional page parameters and canonical page-one redirects, generic CMS pages, Markdown endpoints, feeds, `llms` files, and static file responses. Define the required `prerender`, `entries`, and crawl behavior without implementing it.

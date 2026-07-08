Title: Select representative detail URLs
Type: task
Status: resolved
Blocked by:

## Question

Which concrete work, blog, and photos detail URLs should stand in for their templates during this effort?

Choose pages that are representative rather than easiest: include common above-the-fold media, realistic content density, and normal CMS output. Record why each was chosen so later measurements compare the same pages.

## Answer

Use the same detail URLs that were measured in [PageSpeed Baseline](../assets/2026-07-08-pagespeed-baseline.md):

| Template | Representative URL | Reason |
| --- | --- | --- |
| Work detail | `https://davidhellmann.com/work/rb-leipzig` | Image-heavy work entry with many real CMS gallery images. This intentionally tests the upper bound of the work detail template rather than picking an easy case. |
| Blog detail | `https://davidhellmann.com/blog/tailwindcss-fluid-type-plugin` | Normal article detail page with media and realistic article content. It currently meets the target, so it acts as the control for the blog detail template while other templates are optimized. |
| Photos detail | `https://davidhellmann.com/photos/july-randoms-2026-07-06` | Recent photo gallery with many images and current CMS output. It exercises the actual photo detail/gallery path that is most likely to stress LCP and image delivery. |

These URLs should stay fixed for this effort unless the content disappears or is structurally changed. Later measurement comparisons should use the same detail URLs to avoid moving the target.

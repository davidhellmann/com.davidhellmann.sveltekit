# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

1. First, think through the problem, search the code for relevant files, and write a plan in projectplan.md.
2. The plan should contain a list of tasks that you can check off as they are completed.
3. Before you start working, contact me, and I will review the plan.
4. Then start working on the tasks and mark them as completed one by one.
5. Please explain in detail at each step what changes you have made.
6. Make all tasks and code changes as simple as possible. We want to avoid massive or complex changes. Each change should have as little impact on the code as possible. Simplicity is key.
7. Finally, add a review section to the projectplan.md file that contains a summary of the changes made and any other relevant information.

## Development Commands

### Core Development
- `npm run dev` - Start development server with GraphQL codegen watching
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run svelte-check with TypeScript
- `npm run lint` - Run prettier and eslint checks
- `npm run format` - Format code with prettier

### GraphQL & Code Generation
- `npm run codegen` - Generate GraphQL types and operations
- GraphQL schema auto-generates TypeScript types in `src/lib/graphql/graphql.ts`
- Uses environment variables `GQL_API_URL` and `GQL_API_TOKEN` for CMS connection

### Icons & Assets
- `npm run icons:add` - Add new icons using Sly CLI
- Icons are processed into SVG sprites automatically via vite-svg-sprite-wrapper

### Custom Scripts
- `npm run a` - Run all scopes script
- `npm run f` - Run focus scopes script

## Architecture Overview

### GraphQL & CMS Integration
This is a headless CMS-driven SvelteKit site with sophisticated GraphQL integration:
- **Fragment-based queries** organized by content type in `src/lib/graphql/queries/`
- **Auto-generated TypeScript types** from GraphQL schema
- **Preview token support** for CMS preview functionality
- **Content blocks system** with dynamic rendering via `BlockTypes.svelte`

### Component Architecture
Components are organized by purpose with custom aliases:
- `$components` - All Svelte components organized by function
- `$graphql` - GraphQL client, queries, and generated types
- `$utils` - Utility functions
- `$styles` - CSS and styling
- `$images` - Static images

**Key component categories:**
- **builders/** - Dynamic content building system
- **actions/** - Custom Svelte actions for enhanced functionality
- **modals/** - Lightbox implementations
- **containers/** - Layout components (Grid, Slider, etc.)

### Styling System
- **Tailwind CSS 4.x** with custom utilities
- **Fluid responsive grid** system with 12-column layout
- **Custom CSS properties** for theming and spacing
- **Stack utilities** for consistent vertical spacing
- Uses `tailwind-merge`, `tailwind-variants`, and `clsx` for class management

### Static Site Generation
- Uses `@sveltejs/adapter-static` for full static export
- **Dynamic route generation** from CMS content
- **Custom param matchers** for routing (`uri`, `slug`, `page`, `files`)
- **Selective prerendering** with manual control (crawl disabled)

### Custom Actions
The project includes several custom Svelte actions:
- `useWaypoint` - Intersection Observer animations with stagger support
- `useLightbox` - Image gallery with LightGallery integration
- `useShiki` - Syntax highlighting with Synthwave 84 theme
- `useJumpingLetters` - Interactive text animations
- `useUnlazy` - Lazy loading for images

### Development Server
- Local development at `davidhellmann.sveltekit.test:5173`
- Concurrent GraphQL codegen watching during development
- SVG sprite generation with type generation

## Content Structure

### Route Patterns
- `/` - Home page
- `/[uri=uri]/` - Dynamic CMS pages
- `/blog/[[page=page]]/` - Blog with pagination
- `/blog/[slug=slug]/` - Individual blog posts
- `/work/` - Work portfolio
- `/photos/` - Photo gallery
- `/about/` - About page

### Content Types
The CMS supports various content types with typed GraphQL fragments:
- Blog entries with rich text and code blocks
- Work portfolio items with image galleries
- Photo galleries with EXIF data
- About page with CV and awards sections

### Block System
Content is built using a flexible block system:
- `blockText` - Rich text content
- `blockCode` - Syntax-highlighted code blocks
- `blockImage` - Single images with captions
- `blockImages` - Image galleries
- `blockQuote` - Styled quotes
- `blockCta` - Call-to-action blocks

All blocks are dynamically rendered through the `ContentBuilder.svelte` component.

# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

## Working Process

- Follow the active Codex or Superpowers workflow when one applies.
- For non-trivial changes, share a short plan before editing.
- Keep changes simple, local, and low-impact.
- Explain relevant changes and verification clearly.
- Do not add broad refactors unless explicitly requested.

## Development Commands

### Core Development

- `npm run dev` - Start the local dev server and GraphQL codegen watcher
- `npm run build` - Build the static production output
- `npm run preview` - Preview the production build locally
- `npm run check` - Run Svelte and TypeScript checks
- `npm run test` - Run Vitest tests
- `npm run lint` - Run Prettier and ESLint checks
- `npm run format` - Format files with Prettier

### GraphQL & Code Generation

- `npm run codegen` - Generate GraphQL types and operations
- GraphQL schema and operations generate TypeScript types in `src/lib/graphql/graphql.ts`
- Uses `GQL_API_URL` and `GQL_API_TOKEN` for the CMS connection

### Icons & Assets

- `npm run icons:add` - Add new icons using Sly CLI
- Icons are processed into SVG sprites via `vite-svg-sprite-wrapper`

### Custom Scripts

- `npm run a` - Run all scopes script
- `npm run f` - Run focus scopes script

## Architecture Overview

### GraphQL & CMS Integration

This is a headless CMS-driven SvelteKit site with typed GraphQL integration:

- Queries and fragments live in `src/lib/graphql/queries/`
- Generated TypeScript output lives in `src/lib/graphql/graphql.ts`
- GraphQL client setup lives in `src/lib/graphql/graphql-client.ts`
- Preview tokens are handled in server route loads where needed
- Content blocks are rendered through `ContentBuilder.svelte` and `BlockTypes.svelte`

### Component Architecture

Components are organized by purpose in `src/lib/components/` with custom aliases:

- `$components` - Svelte components organized by function
- `$graphql` - GraphQL client, queries, and generated types
- `$utils` - Utility functions
- `$styles` - CSS and styling
- `$images` - Static images

**Key component categories:**

- `builders/` - CMS content block rendering
- `actions/` - Custom Svelte actions
- `cards/`, `stacks/`, `heros/` - Reusable content presentation components
- `containers/` - Grid, slider, and layout components
- `modals/` - Lightbox implementations

### Styling System

- **Tailwind CSS 4.x** with custom utilities
- **Fluid responsive grid** system with 12-column layout
- **Custom CSS properties** for theming and spacing
- **Stack utilities** for vertical spacing
- Uses `clsx`, `tailwind-merge`, and `tailwind-variants` via `src/lib/utils/classNames.ts`

### Static Site Generation

- Uses `@sveltejs/adapter-static` for full static export
- Dynamic route generation comes from CMS content
- Custom param matchers live in `src/params/` (`uri`, `slug`, `page`, `files`)
- Prerendering is manually controlled with crawling disabled

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
- `/blog/c/[slug=slug]/[[page=page]]/` - Blog category listing with pagination
- `/blog/t/[slug=slug]/[[page=page]]/` - Blog topic listing with pagination
- `/work/` - Work portfolio
- `/work/[slug=slug]/` - Individual work entries
- `/photos/[[page=page]]/` - Photo gallery with pagination
- `/photos/[slug=slug]/` - Individual photo entries
- `/about/` - About page
- `/[filename=files]/` - Static file responses handled by a route server

### Content Types

The CMS supports various content types with typed GraphQL fragments:

- Blog entries with rich text and code blocks
- Blog categories and topics
- Work portfolio items with image galleries
- Photo galleries with EXIF data
- About page with CV and awards sections

### Block System

General page content is built using the `contentBuilder` matrix:

- `block_text` - Rich text content
- `block_code` - Syntax-highlighted code blocks
- `block_image` - Single images with captions
- `block_images` - Image galleries
- `block_quote` - Styled quotes
- `block_cta` - Call-to-action blocks

All blocks are dynamically rendered through the `ContentBuilder.svelte` component.

About-specific matrix content uses dedicated fragments and components:

- `block_curriculumVitae` - CV entries rendered by `CurriculumVitae.svelte`
- `block_award` - Award entries from the about page GraphQL fragments

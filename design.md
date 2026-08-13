# Design System: ToolKit

This document outlines the UI/UX philosophy, design tokens, and aesthetic choices that govern "ToolKit", built by Anand Binu Arjun. It reflects the **actual, current** implementation — treat it as the source of truth for all new tool pages and components.

## 1. Aesthetic Philosophy

ToolKit uses a **Vibrant Minimalist** aesthetic — a clean, bright workspace evoking cutting-edge developer tooling, paired with striking gradient accents.

### Core Traits
- **Light Theme Default**: Minimal white and slate-50 (`#f8fafc`) as the base. Pure, clean brightness that reduces cognitive load when switching between 69+ tools.
- **Vibrant Purple & Cyan Gradients**: The brand uses an electric gradient matching the logo (Purple to Cyan). Used for all primary actions, active states, focus rings, icons, and hero typography. 
- **High Contrast + Restraint**: Vibrant accents pop hard against the clean canvas. We reserve the gradients for truly important UI elements — overuse kills the effect.
- **Monospace as Identity**: `JetBrains Mono` is the primary UI font. Inter is used for prose only.
- **Framer Motion Fluidity**: Interactions and page loads are smooth. Tool grids stagger and fade in natively.

---

## 2. Color Palette (Design Tokens)

Tokens are defined as CSS custom properties in `globals.css` and surfaced to Tailwind via `@theme inline`. All tokens are accessible as `bg-*`, `text-*`, `border-*` Tailwind utilities.

| Token Name           | CSS Variable          | Hex Value   | Purpose |
| :------------------- | :-------------------- | :---------- | :------ |
| `bg-base`            | `--bg-base`           | `#f8fafc`   | Absolute lowest-level background — slate 50. |
| `bg-panel`           | `--bg-panel`          | `#ffffff`   | Elevated panels, cards, and tool containers — pure white. |
| `border-line`        | `--border-line`       | `#e2e8f0`   | All structural borders, dividers, and input outlines. |
| `text-primary`       | `--text-primary`      | `#0f172a`   | Primary headings, active input text, and critical data. |
| `text-muted`         | `--text-muted`        | `#64748b`   | Labels, descriptions, placeholders, and inactive states. |
| `accent-primary`     | `--accent-primary`    | `#8b5cf6`   | **Brand Purple.** Primary buttons, active states, focus rings. |
| `accent-secondary`   | `--accent-secondary`  | `#06b6d4`   | **Brand Cyan.** Secondary highlights, gradients. |
| `accent-warn`        | `--accent-warn`       | `#f59e0b`   | Warm amber. PROCESSING status, warnings, and degraded states. |
| `accent-danger`      | `--accent-danger`     | `#ef4444`   | Rose red. Destructive actions (Clear, Delete), errors, and critical feedback. |

---

## 3. Typography

Fonts are loaded via `next/font/google` in `layout.tsx`.

| Font               | Variable              | Usage |
| :----------------- | :-------------------- | :---- |
| **Inter**          | `--font-sans`         | Prose, paragraphs, long-form readable text only. |
| **JetBrains Mono** | `--font-geist-mono`   | **Everything else.** Form labels, inputs, buttons, data outputs, metric values, panel titles, tab labels, tiny uppercase tracking-wide subheadings. |

### Typography Rules
- `font-mono` is the default for almost all UI chrome.
- Tiny uppercase labels: `text-xs font-bold font-mono uppercase tracking-widest text-accent-primary`.
- Data values (numbers, hashes, sizes): `font-mono font-bold text-text-primary`.
- `html { @apply font-sans; }` — body defaults to sans, components opt in to mono explicitly.

---

## 4. Layout & Spacing

### Page Grid
- Homepage hero: `grid-cols-1 lg:grid-cols-12` — ConsolePanel at `lg:col-span-8`, stats at `lg:col-span-4`.
- Tool grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3`. (Rendered via Framer Motion for stagger effects).
- Major section spacing: `space-y-8` or `space-y-6`.

### Tool Categories
The app has **4 categories** shown as tabs on the homepage. Each tool in `tools-registry.ts` is assigned a `ToolCategory`:

| Category    | Label       | Contents |
| :---------- | :---------- | :------- |
| `"dev"`     | Dev Tools   | Formatters, encoders, converters, security, HTTP tools (21 tools) |
| `"design"` | Design      | Color, gradients, shadows, SVG, image tools, OG, ASCII (11 tools) |
| `"product"` | Product     | QR, UTM, PDF tools, text analysis, timers, productivity (27 tools) |
| `"fun"`     | Fun         | BPM Tapper, Stopwatch, Random Picker, ASCII Image, Retro CRT, CSS Cursors, Text to Speech, Number Namer, Typing Test, Fancy Text (10 tools) |

> **Total: 69 tools**

### Tool Layout (`ToolLayout` Component)
Every individual tool follows a strict structural pattern (see `components/tool-layout.tsx`):

1. **Back Navigation**: `← Back to Registry` link, left-aligned.
2. **Status Indicator**: Right-aligned `STATUS: READY` or `STATUS: PROCESSING` badge.
3. **Heading**: `<h1>` with a `<Terminal />` icon and the tool name.
4. **Description**: `<p className="text-text-muted">` subtitle.
5. **Content**: Wrapped inside a `<ConsolePanel title="{id}.sys">`.

**Note**: Loading a tool automatically adds it to the user's `localStorage` for the "Recently Used" feature.

---

## 5. Core Components

### `ConsolePanel` (`components/ui/ConsolePanel.tsx`)
The primary surface container for all tool content and the homepage hero.

### `OfflineIndicator` (`components/offline-indicator.tsx`)
Floating badge indicating PWA status and network availability. Placed globally in `layout.tsx`.

### `ToolLayout` (`components/tool-layout.tsx`)
Wraps every tool page. Provides navigation, heading, status indicator, and wraps content in a `ConsolePanel`. Records tool visits to `localStorage`.

### `CommandPalette` (`components/command-palette.tsx`)
Triggered via `Cmd/Ctrl + K`. Filters all tools and supports category prefixes (e.g. `dev: json`).

---

## 6. Interaction & Micro-animations

- **Framer Motion**: Grid items (`itemVariants`) use spring animations to pop into view. Hovering over cards triggers a scale and translate effect.
- **Focus States**: All inputs use `focus:border-accent-primary focus:outline-none` — never the browser default ring.
- **Transitions**: `transition-colors duration-200` (or `duration-300`) on all interactive elements.

---

## 7. Navbar & Footer

### Navbar (`layout.tsx`)
- Logo: Features the custom `logo.png`.
- Right side: `<SearchButton />` triggers `<CommandPalette />`

### Footer
- Left: `© {Year} Anand Binu Arjun` and links to `abarjun.online` and `GitHub`.
- Right: `Every tool runs entirely in your browser`

---

## 8. File Structure Reference

```
src/
├── app/
│   ├── globals.css           # CSS custom properties & Tailwind @theme
│   ├── layout.tsx            # Root layout: fonts, navbar, footer, CommandPalette, OfflineIndicator
│   ├── page.tsx              # Homepage: hero grid, Favorites, Recents, 4-tab tool grid (Framer Motion)
│   └── (tools)/
│       ├── image-tools/      # Image Resizer (resize, scale presets, favicon pack)
│       ├── image-converter/  # Image Converter (WebP/JPEG/PNG, batch, quality)
│       └── [tool-id]/
│           └── page.tsx      # All other individual tool pages
├── components/
│   ├── tool-layout.tsx       # Shared tool page wrapper & tracking
│   ├── command-palette.tsx   # Global search (Cmd+K)
│   ├── search-button.tsx     # Navbar search trigger
│   ├── offline-indicator.tsx # PWA/Network status badge
│   └── ui/
│       ├── ConsolePanel.tsx  # Primary surface container
│       ├── StatBlock.tsx     # Metric tile with glow bar
│       └── button.tsx        # shadcn Button base
└── lib/
    └── tools-registry.ts     # TOOLS array: 69 tool definitions
```

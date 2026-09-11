---
name: Distributed Analytics & Observability Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#5a5e69'
  on-secondary: '#ffffff'
  secondary-container: '#dcdfed'
  on-secondary-container: '#5f626e'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dfe2ef'
  secondary-fixed-dim: '#c3c6d3'
  on-secondary-fixed: '#181b25'
  on-secondary-fixed-variant: '#434751'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system serves engineers, SREs, and data platform leads operating high-throughput distributed systems. The brand persona is technical, surgically precise, high-density, and uncompromisingly utilitarian. It draws inspiration from modern developer toolkits, high-frequency telemetry dashboards, and modern financial infrastructure.

Key visual attributes:
- **Developer-Centric Hybrid Canvas:** A deep-slate dark navigational shell juxtaposed against an ultra-crisp, high-contrast light workspace for prolonged, eye-strain-free data interrogation.
- **Structural Precision:** Zero decorative noise, pastel gradients, or pillowy skeuomorphism. Depth is achieved entirely through calibrated micro-borders (1px), subtle structural divisions, and hairline geometric alignments.
- **Monospaced Scaffolding:** Monospaced typography is treated as a primary structural element rather than an edge-case code block, anchoring latencies, timestamps, traces, and metrics.

## Colors

The system uses a split-mode architecture: an inverted, deeply saturated charcoal slate nav container anchoring a high-luminosity neutral data plane.

### Core Swatches
- **Primary Accent (Cobalt Blue):** `#2563EB` (interactive states: `#1D4ED8` hover, `#3B82F6` focus ring/active telemetry markers). Used for primary calls to action, chart line series, and filtered scope indicators.
- **Structural Dark (Shell & Nav):** `#090D16` baseline, with internal borders at `#1E293B` and interactive hover layers at `#131B2E`.
- **Canvas & Surface (Workspace):**
  - Page Background: `#F8FAFC`
  - Elevated Cards & Panes: `#FFFFFF`
  - Subtle Inset Backgrounds: `#F1F5F9`
  - Hairline Borders: `#E2E8F0` (standard) and `#CBD5E1` (hover/interactive)

### Telemetry & Semantic Tokens
- **Operational / Healthy (Emerald):** `#10B981` (Surface tint: `#ECFDF5`, Border: `#A7F3D0`). Used for healthy cluster states, real-time live pings, 2xx HTTP codes, and positive performance deltas.
- **Degraded / Latency Warning (Amber):** `#F59E0B` (Surface tint: `#FFFBEB`, Border: `#FDE68A`). Used for p99 breach warnings, degraded pods, and 4xx status thresholds.
- **Critical / Anomaly (Crimson):** `#EF4444` (Surface tint: `#FEF2F2`, Border: `#FECACA`). Used for dropped traces, error spikes, 5xx server failures, and alert breaches.

## Typography

Typography prioritizes density, tabular precision, and rapid scanning of mixed alphanumerics.

- **Proportional Type (Inter):** Applied across global UI navigation, headings, section titles, and narrative tooltips. Features tight tracking (`-0.01em` to `-0.02em`) on bold metrics to maintain cohesion.
- **Monospaced Engine (JetBrains Mono):** Mandated for all metric readouts, latencies (`ms`, `s`), UUIDs, ISO timestamps, status codes, query strings, and payload schemas. All tabular numbers enforce `font-variant-numeric: tabular-nums` to eliminate jitter during real-time telemetry streaming.
- **Scale Compactness:** The type scale peaks intentionally at 24px desktop for main views, prioritizing real estate for charts, tables, and trace timelines rather than oversized editorial headers.

## Layout & Spacing

The dashboard uses an operational cockpit structure: a persistent dark navigation bar (fixed at 240px desktop, collapsable to 56px icon rail), paired with a fluid, multi-column light telemetry canvas.

### Layout Rules
- **Grid Architecture:** 12-column dynamic flex/grid with tight 12px (`0.75rem`) gutters, allowing metrics cards to pack into 2, 3, 4, or 6 column spans without excessive gap waste.
- **Information Density:** Spacing is compressed by 25-30% relative to standard SaaS platforms. Vertical row heights in tables are constrained to 36px (dense) and 44px (default).
- **Responsive Adaptations:**
  - **Desktop (>= 1280px):** Full sidebar, multi-panel split view (metrics alongside trace stream).
  - **Tablet (768px - 1279px):** Collapsed 56px sidebar, stacked single-column charts with synchronized scrub-bars.
  - **Mobile (< 768px):** Off-canvas navigation drawer, horizontal-scroll data tables, single metric card stack, 16px outer margin.

## Elevation & Depth

This system avoids blurred drop shadows and multi-stop ambient lighting. Instead, elevation is derived from crisp edge delineation and surgical micro-offsets.

- **Level 0 (Canvas Base):** Flat `#F8FAFC`, non-elevated.
- **Level 1 (Panels & Metric Cards):** Background `#FFFFFF`, wrapped in a crisp `1px solid #E2E8F0` border, accompanied by a micro-bevel drop shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hovered Cards & Interactive Rows):** Border shifts to `1px solid #CBD5E1`, with shadow stepping up to `0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Popovers, Filter Menus, Modals):** Surface `#FFFFFF`, border `1px solid #94A3B8`, sharp shadow `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Dark Navigation Elevation:** Uses internal inset separators (`1px solid #1E293B`) without shadows to preserve structural flatness.

## Shapes

The geometry uses a structured, low-radius standard (`roundedness: 1` — base radius of 6px with an 8px ceiling). This preserves a precise, instrument-panel aesthetic while avoiding raw Brutalism.

- **Cards, Panes, & Modals:** Standardized at `6px` (`0.375rem`) to `8px` (`0.5rem`).
- **Inputs, Buttons, & Toolbars:** Strictly `6px` (`0.375rem`).
- **Telemetry Badges & Method Tags:** `4px` (`0.25rem`) for compact tags (e.g., `GET`, `POST`, `p99`).
- **Live Status Pulsers:** Pure circle (`9999px`) restricted solely to real-time telemetry indicator dots and user avatar anchors.

## Components

### Buttons
- **Primary:** Solid `#2563EB` background, white text, 6px radius, height 32px (compact) or 36px (default), 1px solid `#1D4ED8` border. Hover: `#1D4ED8`. Active: `#1E40AF`. Focus: 2px offset ring in `#93C5FD`.
- **Secondary / Ghost:** White background, `#0F172A` text, 1px solid `#E2E8F0` border. Hover: `#F8FAFC` background with `#CBD5E1` border.
- **Destructive:** White background, `#DC2626` text, 1px solid `#FCA5A5`. Hover: `#FEF2F2` background.

### Inputs & Query Bars
- Inset styling with `#FFFFFF` background, 1px solid `#CBD5E1`, height 32px or 36px, typography set to `JetBrains Mono` 12px for query inputs. Focus produces a crisp single-pixel halo: `border-color: #2563EB; outline: 1px solid #2563EB`.

### Data Tables & Log Streams
- **Table Headers:** `#F8FAFC` background, height 32px, text uppercase in `JetBrains Mono` 11px, weight 500, `#64748B`, bottom border 1px solid `#E2E8F0`.
- **Table Cells:** Height 36px, vertical-align middle, bottom border 1px solid `#F1F5F9`. Numeric columns right-aligned with tabular numerals enabled.
- **Row Hover:** Crisp transition to `#F8FAFC`.

### Telemetry Badges & Method Tags
- Micro-pills with 4px radius, uppercase JetBrains Mono 11px.
- `GET`: Background `#EFF6FF`, text `#1D4ED8`, border `1px solid #BFDBFE`.
- `POST`: Background `#ECFDF5`, text `#047857`, border `1px solid #A7F3D0`.
- `DELETE`: Background `#FEF2F2`, text `#B91C1C`, border `1px solid #FECACA`.

### Real-Time Indicators & Metric Cards
- **Metric Cards:** Container with white surface, 1px solid `#E2E8F0`, 16px internal padding. Features a top label in Inter 12px neutral, large value in JetBrains Mono 20px semi-bold, and embedded SVG sparkline with 1.5px stroke width.
- **Live Pulse Dot:** An 8px `#10B981` sphere centered inside an absolute-positioned pseudo-element animating an opacity/scale wave to signal active socket connections.
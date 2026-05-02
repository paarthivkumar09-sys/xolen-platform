# XOLEN – Stay + Services Platform Design System

## Overview
**Purpose:** High-conversion, trust-first stay platform combining Airbnb flexibility, OYO economics, and Urban Company verification. Tone: reassuring, minimal, actionable. Every element signals safety and speed.

## Differentiation
XOLEN Verified badges + 90% instant refund guarantee + urgency scarcity ("Only 2 rooms left") + skeleton loaders on all lists + sticky mobile CTAs. Trust is the primary design lever.

## Color Palette (OKLCH)

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `primary` | 0.56 0.26 16.8 | 0.68 0.28 16.8 | Orange (#FF6B35 equivalent) – Book Now, CTAs, trust badges |
| `secondary` | 0.53 0.24 258 | 0.65 0.28 258 | Blue (#0066FF equivalent) – Secondary actions, verification, info |
| `background` | 0.99 0 0 | 0.12 0 0 | White (light) / almost-black (dark) |
| `card` | 1.0 0 0 | 0.16 0 0 | Clean elevation surface |
| `muted` | 0.92 0 0 | 0.25 0 0 | Subtle backgrounds for disabled/inactive states |
| `destructive` | 0.55 0.22 25 | 0.65 0.19 22 | Red for refund/cancel actions only |
| `accent` | 0.56 0.26 16.8 | 0.68 0.28 16.8 | Orange – same as primary; urgency badges |
| `border` | 0.9 0 0 | 0.25 0 0 | Light grey dividers |
| `input` | 0.93 0 0 | 0.25 0 0 | Form field backgrounds |

## Typography

| Layer | Font | Weight | Size | Usage |
| --- | --- | --- | --- | --- |
| Display | General Sans | 700 | 28px–48px | Hero titles, property name, booking confirmations |
| Body | Plus Jakarta Sans | 400–600 | 14px–16px | Card copy, descriptions, labels |
| Mono | JetBrains Mono | 400–600 | 12px–14px | Prices, IDs, booking references, codes |

## Structural Zones

| Zone | Background | Border | Padding | Shadow |
| --- | --- | --- | --- | --- |
| Header (sticky mobile) | `card` (white/dark) | `border-b` subtle | 12px 16px | `shadow-xs` |
| Property Card | `card` | `border-border` | 16px | `shadow-md` |
| Content Section | `background` | none | 16px vertical | none |
| Footer | `muted/30` | `border-t` | 24px 16px | none |
| Decision Modal (Book/Refund) | `card` with overlay | subtle | 24px | `shadow-lg` |

## Spacing & Rhythm
- **Density:** 16px base padding on cards, 12px gaps between list items
- **Mobile stack:** 100% width with 16px horizontal padding (375px min)
- **Desktop grid:** 2–3 columns at `md:` (768px+), 4 columns at `lg:` (1024px+)
- **Vertical rhythm:** 24px section breaks, 16px component gaps

## Component Patterns
- **Cards:** 8px `border-radius`, white `bg-card`, subtle `shadow-xs` on light, `shadow-md` on hover
- **Buttons:** Orange primary (Book Now, Verify, Continue), blue secondary (View Details, Learn More), muted tertiary (Cancel, Skip)
- **Badges:** "XOLEN Verified" (green circle + text), "Only 2 left" (orange tag), "Most booked" (blue tag), "Recommended" (secondary color)
- **Skeleton loaders:** Light grey animated pulse on all list/table views; property cards, booking history
- **Sticky button (mobile):** Orange "Book Now" 48px height, full width, fixed bottom, safe-area inset
- **Forms:** Light grey `input` backgrounds, blue focus ring (`ring: 0.53 0.24 258`), inline validation errors in red
- **Modals:** Dark overlay (rgba 0,0,0,0.5), card center, 8px radius, 24px padding

## Motion & Animations
- **Default transition:** `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (material curve)
- **Entrance:** Fade + 12px y-translate down (200ms)
- **Hover state:** `opacity-90` on cards, subtle lift (shadow increase)
- **Loading:** Pulse animation on skeleton elements (1s loop, opacity 0.5 → 1)
- **Success:** Toast fade in (200ms) + auto-dismiss 3s

## Mobile-First Constraints (375px–480px)
- All text 14px minimum (Plus Jakarta Sans 400)
- Buttons 48px min touch height
- Property cards full width, image 200px height
- Header sticky always; navigation stacks vertically in hamburger menu
- No side panels; use modals for filters/settings
- Sticky "Book Now" button with refund message below

## Accessibility
- Focus rings: blue `ring: 0.53 0.24 258`, 2px width
- Contrast: AA+ minimum (tested on light + dark)
- ARIA labels on all interactive elements
- Verified badge includes accessible tooltip
- Form errors announced; spinner includes `role="status"`

## Signature Detail
**Trust Ledger:** Every verified property, successful booking, and refund is logged in a sidebar panel (owner/admin). Shows live confidence metrics: "2,847 successful stays this month", "99.2% verified properties". Builds psychological safety.

---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one in Google Antigravity and Agyis Harness. Integrates modern web standards (modern-web-guidance), Chrome DevTools visual inspection, automated a11y auditing, monorepo design tokens (@sunshine/tokens), and generative UI mockups.
---

# Frontend Design & Visual Craftsmanship

Approach this as the design lead at a specialized design studio known for giving every client and application a distinct, unforgettable visual identity that is never mistaken for templated software. The client has already rejected generic proposals that felt like generated boilerplate and is paying for a deliberate, opinionated point of view. Make bold, disciplined choices about palette, typography, hierarchy, and micro-interactions that are specific to the clinical physiotherapy and rehabilitation domain, taking justified aesthetic risks while anchoring to strict clinical accessibility standards.

---

## 1. Ground Designs in the Subject Matter

If the brief does not define what the product or subject matter is, identify it before designing:
- **Domain Context**: Sunshine Physiotherapy is a modern clinical physiotherapy and rehabilitation practice in Bangladesh. The subject matter centers on physical recovery, movement restoration, pain relief, anatomical wellness, and patient empowerment.
- **Audience**: Patients experiencing acute or chronic pain, post-surgical recovery, elderly individuals seeking mobility care, and clinical practitioners managing consultations and treatment schedules.
- **Aesthetic Direction**: Botanical healing calm, clinical authority, warmth without hospital sterility. Reject cold, clinical blue hospital software just as strongly as tech-startup neon gimmicks.
- **Content Realism**: Always design with real clinical copy and patient workflows throughout (e.g., triage assessments, slot bookings, pain scales, therapist credentials) rather than generic placeholder text ("Lorem ipsum", "Feature 1", "Card title").
- **Decluttered Booking Intake Flow (`/book`)**:
  - Implement a lean, single-column reception triage intake: Pain Category, Preferred Time Window, Name, BD Phone (`+880` / `01[3-9]\d{8}`).
  - Clinical appointments and clinician assignments are managed centrally by clinic reception via the back-office triage console (`/triage`), rather than forcing patients to navigate complex practitioner rosters while in physical discomfort.
  - Doctor selection panes, specialist roster resolution, and slot picker links are **completely eliminated** from `/book`.
  - For referrals originating from doctor profiles on `/team`, accept an optional `?specialist=<slug>` query param that renders only a subtle 1-line preferred specialist note (e.g., *"Referred to Dr. Aris Thorne"*) without reintroducing complex doctor browse panes or calendar slot pickers.

---

## 2. Foundational Design Principles & Anti-Trope Discipline

### 2.1 The Signature Hero & Purposeful Visual Hierarchy (Chanel Anchor)
- The hero is the first thing patients and clinicians see. Open with the most characteristic element in the subject's world: a clear headline articulating restorative care, a live interactive booking or assessment module, or an anatomical visualization.
- Avoid the cliché pattern: a big metric number with a tiny label, generic supporting cards, and a bright purple gradient wash. Only use numbers and statistics when they deliver clinical value.
- **Spend your boldness in one place (Chanel Anchor)**: Let one element be the memorable visual anchor of the page. Keep surrounding chrome quiet, disciplined, and functional. Cut every decorative flourish that does not serve clinical clarity.
- **Macro-Level Public UI Restraint**:
  - **Single Primary CTA per Section**: Enforce exactly one prominent primary CTA per section (e.g., Hero single CTA: "Begin Recovery Assessment" or "Schedule Consultation"). Never dilute patient decision-making with competing primary buttons or side-by-side equal-weight CTAs. Any supporting action must be styled as a subordinate text link or secondary quiet button.
  - **Scannable Clinical Accordions & Chips**: Collapse verbose service and condition card grids into scannable clinical accordions and compact chips. Eliminate AI template chrome, repetitive card borders, and unmotivated animations.
  - **Compact Header Chrome Cluster**: Group global secondary controls (Branch Switcher for Gulshan/Dhanmondi and Language Toggle for EN/BN) into a tight, unified header chrome cluster, keeping navigation quiet, uncluttered, and secondary to the primary clinical message.
  - **Decluttered Booking Intake Hero (`/book`)**: Focus the intake hero on a single-column reception triage questionnaire (Pain Category, Preferred Time Window, Name, BD Phone). Completely eliminate doctor selection panes, specialist roster browsing, and slot pickers. An optional `?specialist=<slug>` from `/team` referrals renders only a subtle 1-line preferred specialist note.
- **Restraint and Self-Critique**: Adopt Coco Chanel's design heuristic: before finishing an interface, review it and remove at least one unnecessary decorative element. Interfaces gain dignity through subtraction.

### 2.2 Typographic Hierarchy & Character
- Typography carries the personality and dignity of the interface. Use one or two font families at most:
  - **Latin / English**: Clean, legible neutral grotesque (`Inter` from `@sunshine/tokens`).
  - **Bengali**: High-legibility Bengali sans (`Hind Siliguri`, `Noto Sans Bengali`).
- Maintain a strict typographic scale with intentional weights and line heights (`typography.fontSizes` in `@sunshine/tokens`). Treat headline typography as an active visual component, not just an unstyled container for text.
- Enforce comfortable reading line lengths: `<80` characters for desktop body copy. Provide generous line-height (`1.5` to `1.75`) for patient readability under physical discomfort or visual strain.
- **Avoid Default Typographic Tells**:
  - Never accent just a single word or phrase in a headline (e.g. rendering one word in italics, bold, or a contrasting accent color).
  - Do not use all-caps for labels or text blocks.
  - Do not place unnecessary floating typographic labels above content headings.
  - Do not misapply monospace fonts for small clinical data labels or metadata unless displaying actual code, identifiers, or serial numbers.

### 2.3 Strict Avoidance of AI-Generated Design Clichés
For calibration, generated interfaces frequently default to recognizable AI tropes. Avoid these telltale clichés unless the brief explicitly commands them:
1. **The Claude Cliché**: Warm cream background (`#F4F1EA`) paired with high-contrast serif display and terracotta/warm-clay accent (`#D97757`).
   > [!IMPORTANT]
   > **Brand Kit Disambiguation**: Do NOT confuse the prohibited Claude Cliché (`#D97757` terracotta paired with high-contrast serif display) with Sunshine Physio's official Brand Kit Warm Mahogany (`#713917`, `colors.brand.navy` / `--color-brand-navy` / `--color-brand`). Warm Mahogany is the clinic's authentic corporate identity mark extracted from master vector assets (`brands/kit.svg`), and is grounded with clean, clinical sans-serif typography (`Inter` / `Hind Siliguri`), never editorial serif styling.
2. **The Cybersecurity / Crypto Cliché**: Pitch-black or dark slate background (`#0B0B0B`) drenched in high-saturation neon acid-green (`#00FF66`) or vivid vermilion accents.
3. **The Broadsheet Cliché**: Over-stylized newspaper broadsheet layouts with hairline rules, zero border-radius, and dense, multi-column blocks ill-suited to clinical clarity.
4. **The SaaS-Card Kit & Verbose Card Grids**:
   - Chopping every page into identical rounded cards (`rounded-xl`), uniform border-radius on every element regardless of hierarchy, the same soft grey shadow (`rgba(0,0,0,0.1)`), repetitive card borders, and decorative gradient washes.
   - **Clinical Scannability Mandate**: Collapse verbose service and condition card grids into scannable clinical accordions and compact condition chips. Patients suffering from acute pain or motor strain need rapid symptom identification, not heavy card grids with repetitive borders and AI template chrome.
5. **Template Chrome & Macro Clutter**:
   - Tracked-out ALL CAPS labels or eyebrows (`SERVICES`, `TESTIMONIALS`) above every single heading.
   - Arbitrary numbered markers (`01`, `02`, `03`) on lists that are not strict chronological sequences (e.g., triage steps or timelines).
   - Spaced em-dash metadata labels (`CATEGORY — 5 min read`).
   - Chains of items joined by middle dots (`A · B · C`).
   - Trailing arrows (`→`) redundantly appended to every button and link.
   - Multiple competing primary CTAs in a single section (violating single primary CTA restraint).
   - Sprawling, unbundled header controls (always bundle Branch Switcher and Language Toggle into a compact header chrome cluster).
6. **Unmotivated Motion**:
   - Staggered fade-up entrances on every card during scroll.
   - Gratuitous hover scale lifts (`hover:-translate-y-2`) on passive informational cards.
   - Motion should strictly answer user input (expanding drawers, confirming bookings, toggling accordions) to clarify state transitions.
7. **CSS Specificity Collisions**:
   - Avoid generating competing CSS classes or nested selectors that cancel each other out (especially type-based selectors like `.section` clashing with element-based selectors like `.cta`, or padding/margin overrides between parent and child containers). Keep selectors flat and modular.

### 2.4 Writing as Design Content
- Words are design elements, not afterthoughts. Bring the same minimalism and precision to UI copy that you bring to spacing and color:
  - **Patient Perspective**: Name features by what patients understand ("Schedule Appointment", "My Exercises", "Billing & Receipts"), not internal engineering concepts ("Webhook Dispatcher", "Slot Mutator").
  - **Active Voice & Clear CTAs**: Buttons declare exactly what will happen ("Confirm Booking", "Save Changes", "Call Clinic"). Maintain vocabulary cohesion across the user journey (a button labeled "Confirm Booking" transitions to a banner saying "Booking Confirmed").
  - **Dignified Errors & Clear Empty States**: Errors do not apologize, and they are never vague about what happened. Explain what occurred and offer an immediate remedy in plain language without synthetic apologies or technical jargon. Empty states should be invitations to take action (e.g., "No upcoming appointments. Schedule your first physical therapy session.").
  - **Conversational Tone**: Plain verbs, sentence case, no filler copy, with tone matched to clinical empathy and practitioner professionalism. Let each written element perform exactly one job.

### 2.5 The Two-Pass Design & Review Workflow
Always execute interface design in two deliberate passes before authoring production code:
1. **Pass 1: Brainstorm the Design Plan**:
   - *Palette*: Select 4–6 named tokens directly from `@sunshine/tokens` (`navy` [Warm Mahogany], `teal`, `tealDark`, `sunshineAmber`, `amberText`, `cream`, `ink`).
   - *Typography*: Declare font families (`Inter`, `Hind Siliguri`) and roles from `typography.fontSizes`.
   - *Layout & Alignment*: Draft a concise ASCII wireframe or 1-sentence spatial description establishing alignment (left-aligned, centered, full-width) and visual weight.
   - *Signature Anchor*: Designate the single memorable hero element of the page.
2. **Pass 2: Adversarial Self-Critique Against the Brief**:
   - Cross-check the draft plan against the clinical requirements. Ask: *Does any part of this layout read like a generic AI template (cream+clay, card-kit, neon, SaaS defaults)?*
   - If any aspect is generic, revise the plan, explicitly noting what was changed and why.
   - Only start writing code after confirming the distinctive, purposeful nature of the revised plan.

### 2.6 Implementor Governance & Fast Verification Standards
To ensure rigorous architectural and visual craftsmanship across the multi-agent fleet:
1. **Mandatory Skill Reading**: Every design implementor subagent MUST explicitly inspect `.agents/skills/frontend-design/SKILL.md` via `view_file` before writing or modifying any UI component or style.
2. **Transcript Verification**: Implementors must explicitly document and record both **Pass 1** (Design Plan) and **Pass 2** (Adversarial Critique) in their task transcript and implementation plan before authoring code.
3. **Fast Diff-Based Inner-Loop Testing**:
   - Use `pnpm test:diff` (runs `vitest run --changed` in ~1s) or `pnpm test:related <file>` for sub-second test execution during iterative development.
   - Use `pnpm --filter @sunshine/web typecheck` (~3.5s) for scoped type validation.
   - Never trigger slow, unfiltered monorepo test sweeps in tight loops.
   - Pure styling, CSS, or documentation changes do not require executing unit test suites.
4. **Commit Discipline & GPG Signing**:
   - All commits on `kuasha420/frontend` must adhere strictly to Conventional Commits (`feat`, `fix`, `docs`, `refactor`).
   - Every commit MUST be GPG-signed with `-S` (`git commit -S -m "..."`) using key `605C561448D10B4D4DFF1D1EE2B0F4C15711342F`.

---

## 3. Universal Design Token Grounding (`@sunshine/tokens`)

All visual elements across web (`apps/web`) and mobile (`apps/expo`) MUST bind directly to the single source of truth in `@sunshine/tokens`:

```typescript
import {
  colors,
  spacing,
  touchTargets,
  radii,
  shadows,
  typography,
  breakpoints,
  getContrastRatio,
} from '@sunshine/tokens';
```

### 3.1 Canonical Botanical Healing & Clinical Warmth Palette
- **Warm Mahogany & Corporate Foundation** (Authentic Corporate Anchor & Clinical Grounding):
  - Primary Brand Warm Mahogany: `colors.brand.navy` / `colors.navy[800]` (`#713917` / `--color-brand` / `--color-brand-navy`) — Official corporate identity anchor from `brands/kit.svg`; high-contrast authority grounding ($\ge 8.4:1$ on cream `#FBF7EF`, $\ge 9.1:1$ on white `#FFFFFF`, WCAG AAA compliant).
  - Deep Mahogany Shade: `colors.navy[900]` (`#52270E` / `--color-brand-dark`)
  - Warm Mahogany Light: `colors.navy[600]` (`#834F30` / `--color-brand-light`)
  - Warm Surface Tint: `colors.navy[50]` (`#FAF5F0` / `--color-brand-surface`)
- **Teal / Forest Restoration** (Clinical Authority & Calming Care):
  - Primary Teal: `colors.brand.teal` (`#2E6B5E`)
  - Deep Clinical Pine: `colors.brand.tealDark` (`#1F4C42` / `colors.teal[800]`) — WCAG AAA on cream.
  - Active Sage Highlight: `colors.brand.tealLight` (`#3D8B7B`)
- **Sunshine Amber & Warm Gold** (Vitality, Rehabilitation, Movement):
  - Primary Sunshine Amber: `colors.brand.sunshineAmber` (`#E2963A` / `colors.warmAmber[500]`)
  - Warm Sunbeam Accent: `colors.brand.sunshineGold` (`#F0B060` / `colors.warmAmber[400]`)
  - Accessible Amber Text: `colors.brand.amberText` (`#8C4600` / `colors.warmAmber[800]`) — Certified contrast ratio $\ge 6.5:1$ on cream.
- **Warm Healing Neutrals** (Eliminating Hospital Glare):
  - Warm Alabaster Neutral: `colors.brand.cream` / `colors.cream.DEFAULT` (`#FBF7EF`)
  - Sand Neutral Borders: `colors.sand[300]` (`#E4DCC8`)
- **Botanical Ink Text**:
  - Primary Body & Headings: `colors.brand.ink` / `colors.ink.primary` (`#20291F`) — High-contrast, soft on the eyes ($>10:1$ on cream).
  - Muted Meta & Subtitles: `colors.ink.muted` (`#5B6459`)
- **Semantic Feedback**:
  - Success: `colors.semantic.success.DEFAULT` (`#10B981`)
  - Error: `colors.semantic.error.DEFAULT` (`#EF4444`)
  - Warning: `colors.semantic.warning.DEFAULT` (`#F59E0B`)

### 3.2 Spacing, Radii, and Touch Target Tokens
- **Spacing Scale**: 4px baseline increments (`spacing[1]` = 4px, `spacing[4]` = 16px, `spacing[6]` = 24px, `spacing[8]` = 32px, `spacing[12]` = 48px).
- **Mobile-First Adaptive Spacing & Breakpoint Density**:
  - Eliminate universal, coarse spacing that leaves mobile screens sparse, hollow, or inefficient. Spacing must adapt across responsive breakpoints:
    - **Mobile (`< 768px`)**: Tight, space-efficient padding and gaps: container padding `p-3.5` (14px), item gap `gap-2.5` (10px), and section vertical rhythm `py-6` (24px).
    - **Tablet (`768px - 1024px`)**: Balanced expansion: container padding `p-5` (20px), item gap `gap-4` (16px), and section vertical rhythm `py-10` (40px).
    - **Desktop (`> 1024px`)**: Spacious clinical breathing room: container padding `p-6` (24px), item gap `gap-6` (24px), and section vertical rhythm `py-14` (56px).
- **Radii**: Subtle, structured curvature (`radii.sm` = 4px, `radii.DEFAULT` = 8px, `radii.md` = 12px, `radii.lg` = 16px, `radii.full` = 9999px).
- **Strict Interactive Touch Target Floor**:
  - The minimum interactive dimension is strictly **$\ge 48 \times 48$px** (`touchTargets.minSize: '48px'`, `touchTargets.minHeight: '48px'`) across all clickable elements, buttons, form inputs, and navigation toggles on mobile and tablet to support patients with tremors, acute pain, or motor limitations.
  - In dense desktop data grids or secondary actions, interactive targets must never drop below **$44 \times 44$px** (WCAG 2.1 AAA).
  - Note: Adaptive spacing tightens container margins and gaps, but **never compresses interactive tap areas below the 48px floor**.

---

## 4. Modern Web Standards via `modern-web-guidance`

Before writing custom layout logic, bespoke JavaScript wrappers, or importing heavy npm UI packages, agents MUST query `modern-web-guidance` to leverage native browser primitives:

### 4.1 Invocation Commands
```bash
# 1. Search modern web standards for a given UI pattern or behavior (pnpx preferred in pnpm repo)
pnpx modern-web-guidance@latest search "<query>"
# Alternative with npx:
npx -y modern-web-guidance@latest search "<query>"

# 2. Retrieve the complete, authoritative guide for a specific guide ID
pnpx modern-web-guidance@latest retrieve "<guide-id>"

# 3. Browse all available guides if search returns low similarity or empty matches
pnpx modern-web-guidance@latest list
```

### 4.2 Sandboxed & Offline Execution
- **Offline / Sandbox Fallback**: If network access is restricted or the command times out, re-run with `--offline`:
  ```bash
  pnpx modern-web-guidance@latest --offline search "<query>"
  ```
- **Cache Path**: In environments where `~/.npm` is read-only, prefix with `NPM_CONFIG_CACHE=/tmp/npm-cache`.

### 4.3 Mandatory Native Patterns & Browser Baseline
- **Native Overlays & Menus**: Prefer the native Popover API (`popover="auto"`, `popovertarget`) and `<dialog>` elements with `::backdrop` styling over custom modal/portal JavaScript libraries.
- **Smooth State Transitions**: Implement the View Transitions API (`document.startViewTransition`) for tab switches, filter changes, and view mutations.
- **CSS `:has()` Parent Selectors**: Use `:has()` to conditionally style containers based on input state, error status, or child presence without synchronizing React state.
- **Container Queries (`@container`)**: Use container queries for self-contained UI widgets (such as doctor slot cards, appointment badges, and triage forms) so they adapt gracefully to sidebars, modals, or full-width layouts.
- **Validation Ergonomics**: Apply CSS `:user-valid` and `:user-invalid` pseudo-classes to display validation feedback only after user interaction.
- **Performance & Asset Loading**: Ensure LCP hero images include `fetchpriority="high"` and below-the-fold content sections utilize `content-visibility: auto`.
- **Baseline Support Policy**: All features tagged as **Baseline Widely available** require zero custom fallbacks. For Baseline Newly Available features, provide clean, progressive fallbacks without heavy external polyfills.

---

## 5. Chrome DevTools & Visual Regression Inspection

Visual and accessibility verification requires empirical validation via DevTools MCP tools:

### 5.1 DevTools MCP Workflow
1. **Target Discovery & Selection**: Call `list_pages` to inspect active browser tabs, then `select_page` to focus on the target application URL.
2. **Deterministic Navigation**: Launch or direct the browser using `navigate_page` or `new_page` targeting the local preview server (`http://localhost:3000` for Web, `http://localhost:8081` for Expo Web).
3. **Wait for DOM Stability**: Invoke `wait_for` to guarantee asynchronous API data loads, fonts, and hydration have fully settled.
4. **Capture Accessibility Snapshot**: Call `take_snapshot` to extract the accessibility tree, semantic roles, heading levels, and interactive element `uid`s without flooding conversation context.
5. **Interactive UI Verification**: Execute user interactions (`click`, `fill`, `press_key`) using element `uid`s from `take_snapshot` to exercise dialogs, slot selectors, and form validation states.
6. **Viewport Adjustment & Responsive Testing**: Use `resize_page` (`width`, `height`) and `emulate` (`viewport`, `colorScheme`) to configure canonical viewport dimensions matching `viewportPresets` from `@sunshine/tokens` (360px `mobile-sm`, 390px `mobile-std`, 768px `tablet`, 1280px `desktop-md`, 1920px `desktop-lg`) and test dark/light color schemes.
7. **Visual Inspection & Viewport Audits**: Call `take_screenshot` with `filePath` (e.g. `test-results/screenshots/web-<feature>-360px.png`) at each configured viewport to verify layout adaptability and aesthetic dignity.
8. **Console & Diagnostic Sweep**: Call `list_console_messages` with `types: ["issue", "error"]` and `includePreservedMessages: true` to catch unhandled errors, CSP violations, or CSS layout bugs.
9. **DOM Geometry Evaluation**: Use `evaluate_script` to measure exact element dimensions, scroll containers, or computed styles when accessibility snapshots lack spatial metrics.

### 5.2 Browser Command Integration (`/browser`)
When conducting visual validation and inspecting web flows interactively:
- **Interactive Visual Preview**: Use the `/browser` workflow to launch interactive user sessions against local servers (`http://localhost:3000` for Web, `http://localhost:8081` for Expo Web).
- **Live User Journeys**: Exercise end-to-end patient booking, clinical assessment, and therapist scheduling flows in real-time.
- **Visual Validation & DOM Snapshots**: Inspect live DOM snapshots during interactive transitions, confirming element states, modal focus trapping, and drawer animations across mobile and desktop viewports.
- **Micro-Interaction Polish**: Manually verify hover states (`@media (hover: hover)`), focus ring visibility, and fluid layout responsiveness before committing code.

---

## 6. Automated Accessibility Verification (`a11y-debugging`)

Accessibility is non-negotiable in healthcare applications. All frontend interfaces must adhere to WCAG 2.2 AA / AAA standards:

### 6.1 Automated Audit via Lighthouse (`lighthouse_audit`)
Execute an automated accessibility audit to establish an objective baseline:
1. **Trigger Audit via DevTools MCP**: Call `lighthouse_audit` with `mode: "navigation"`, `outputDirPath: "/tmp/lh-report"`, and `device: "desktop"` (or `"mobile"` for handheld viewports).
   ```json
   {
     "mode": "navigation",
     "outputDirPath": "/tmp/lh-report",
     "device": "desktop"
   }
   ```
   *Alternative CLI invocation*:
   ```bash
   npx lighthouse http://localhost:3000 --only-categories=accessibility --output=json --output-path=/tmp/lh-report/report.json --chrome-flags="--headless"
   ```
2. **Concise Report Parsing (Zero Context Flooding)**: Extract failing audits and offending selectors without dumping thousands of report lines into context:
   ```bash
   node -e "const r=require('/tmp/lh-report/report.json'); Object.values(r.audits).filter(a=>a.score!==null && a.score<1).forEach(a=>console.log(JSON.stringify({id:a.id, title:a.title, items:a.details?.items})))"
   ```

### 6.2 Semantic Landmarks & Heading Structure
- **ARIA Landmark Validation**: Wrap all page regions in standard semantic landmarks (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`). Verify in `take_snapshot` that landmarks expose corresponding roles: `banner`, `main`, `navigation`, `complementary`, `contentinfo`. No interactive controls or content should sit uncontained outside landmarks.
- **Strict Heading Hierarchy**: Every page must have exactly one logical `<h1>`. Headings must progress sequentially (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`) without skipping levels.

### 6.3 Accessible Names & Form Labels (WCAG 4.1.2)
- **Universal Accessible Names**: Every interactive element (buttons, links, inputs, icon toggles) MUST expose a clear accessible name:
  - Text controls: ensure visible text clearly conveys the action.
  - Icon-only controls (e.g., modal close buttons `×`, chevron selectors, search icons): MUST provide an explicit `aria-label` or `aria-labelledby` (e.g., `aria-label="Close dialog"`). Never leave controls with empty `name: ""` in `take_snapshot`.
- **Form Label Association**:
  - Every `<input>`, `<select>`, `<textarea>` must be associated with a visible `<label>` via `htmlFor`/`id` binding or explicit `aria-labelledby`.
  - Check for orphaned inputs using `evaluate_script`:
    ```javascript
    () => Array.from(document.querySelectorAll('input, select, textarea')).filter(i => !(i.id && document.querySelector(`label[for="${i.id}"]`)) && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !i.closest('label')).map(i => ({ tag: i.tagName, id: i.id, name: i.name }))
    ```

### 6.4 Keyboard Navigation, Focus Rings & Trapping
- All interactive elements must be reachable via `Tab` / `Shift+Tab`. Test focus order using `press_key` (`"Tab"`).
- Never remove focus rings without replacing them (`outline: none` without a custom focus indicator is strictly banned).
- Provide visible, high-contrast focus rings:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2
  ```
- Modals, slide-overs, and bottom sheets must trap focus upon opening and restore focus to the triggering element upon dismissal.

### 6.5 Mathematical Contrast Thresholds
Verify color contrast mathematically using `getContrastRatio` from `@sunshine/tokens`:
- **Normal Body Text**: Contrast ratio $\ge 4.5:1$ against background.
- **Large Text / Headings** ($\ge 18$pt or $\ge 14$pt bold): Contrast ratio $\ge 3:1$.
- **Warm Mahogany on Cream**: Contrast ratio $\ge 8.4:1$ (`colors.brand.navy` / `#713917` on `#FBF7EF` achieves $\sim 8.55:1$, WCAG AAA compliant; on white `#FFFFFF` achieves $\sim 9.13:1$).
- **Sunshine Amber / Colored Text**: Contrast ratio $\ge 6.5:1$ on cream backgrounds (use `colors.brand.amberText`: `#8C4600` on `#FBF7EF`, which achieves $\sim 6.6:1$).
- **Dark Pine on Cream**: Contrast ratio $\ge 7:1$ (`colors.brand.tealDark` achieves $\sim 8.2:1$).
- **Ink on Cream**: Contrast ratio $\ge 10:1$ (`colors.brand.ink` achieves $\sim 13.8:1$).
- **Live DOM Verification via DevTools MCP**: For computed contrast checks of rendered elements, pass the element's `uid` to `evaluate_script`:
  ```javascript
  el => {
    function getRGB(str) {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : [255, 255, 255];
    }
    function lum(r, g, b) {
      const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    const s = window.getComputedStyle(el);
    const fg = lum(...getRGB(s.color)), bg = lum(...getRGB(s.backgroundColor));
    const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    return { color: s.color, bg: s.backgroundColor, contrastRatio: Number(ratio.toFixed(2)) };
  }
  ```

### 6.6 Touch Target Dimensions
- **Clinical Target Standard**: All interactive controls, slot selectors, inputs, and buttons must meet a minimum bounding box of **$48 \times 48$px** (`touchTargets.minSize: '48px'`).
- **Minimum 44x44px Absolute Floor**: In dense desktop data grids or secondary actions, interactive targets must never drop below **$44 \times 44$px** (WCAG 2.1 AAA).
- **Adequate Spacing**: Provide at least 12px touch padding (`touchTargets.touchPadding: '12px'`) between adjacent interactive elements.
- **Measurement via DevTools MCP**: Since `take_snapshot` does not provide bounding box dimensions, verify rendered element sizes with `evaluate_script` using element `uid`:
  ```javascript
  el => {
    const rect = el.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  }
  ```

### 6.7 Document-Level Accessibility & Global Page Checks
Verify document-level accessibility settings often missed during component authoring:
- **Language & Title**: Ensure `<html>` defines an explicit `lang` attribute (`lang="en"` or `lang="bn"`) for screen reader pronunciation, and `<title>` provides clear application context.
- **Viewport Scalability**: Confirm `<meta name="viewport">` does not disable user scaling (`user-scalable=no` or `maximum-scale=1` violates WCAG 1.4.4 Resize text).
- **Reduced Motion**: Respect system accessibility preferences via `@media (prefers-reduced-motion: reduce)` to disable non-essential animations.
- **Automated Global Verification**: Run via `evaluate_script`:
  ```javascript
  () => ({
    lang: document.documentElement.lang || 'MISSING - Screen readers require lang for pronunciation',
    title: document.title || 'MISSING - Required for page context',
    viewport: document.querySelector('meta[name="viewport"]')?.content || 'MISSING - Check for user-scalable=no',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Enabled' : 'Disabled',
  })
  ```

---

## 7. Interactive Mockups & Generative UI

Before committing complex multi-screen features, validate concepts using Antigravity's generative UI and visualization capabilities:

### 7.1 Standalone HTML Prototypes & `<agent-embed>`
- **CSP & Allowlisted Tailwind CDN**: All external CDNs (including `cdn.tailwindcss.com`) are strictly **blocked by Content Security Policy (CSP)** in Antigravity. The ONLY allowlisted Tailwind script source is Google's official gstatic CDN:
  ```html
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  ```
- **Inline Chat Embeds (`<agent-embed>`)**:
  - To embed compact interactive widgets directly into the chat response, use the `<agent-embed>` tag:
    ```html
    <agent-embed src="file:///<artifact_path>/widget.html"></agent-embed>
    ```
  - **Height Budget & Sizing Invariant**: Inline embeds have a **500px height limit**.
    > [!IMPORTANT] Never size an inline widget relative to the viewport: **never use `min-h-screen`, `h-screen`, `100vh`, or `height: 100%`** on top-level containers. The frame's viewport is derived from your content; viewport height classes cause circular sizing dependencies that collapse the widget to a thin sliver. Use padding (`p-5`) instead.
  - **Transparent Chat Integration**: Set `<body class="bg-transparent text-[var(--foreground)] p-5">` so the widget root blends seamlessly into the host chat stream, and wrap controls in elevated cards (`bg-[#FBF7EF]` or `bg-[var(--card)]`).
  - **Typography & Minimum Font Floor**: Typography is applied dynamically by the host body. **Never use sub-12px micro-text** (`text-[10px]`, `text-[11px]`, or CSS `font-size < 12px`; keep `text-xs` / `12px` as the minimum floor).
  - **No Local Fallbacks on `:root`**: Never define local color fallbacks on `:root` in a `<style>` block; the host environment manages theme variables dynamically.
- **Standalone Artifacts (Side-Pane Prototypes)**:
  - For full-page experiences (clinical dashboards, triage questionnaires, slot booking flows), default to standalone artifacts saved via `write_to_file` with metadata:
    ```typescript
    ArtifactMetadata: {
      UserFacing: true,
      RequestFeedback: true,
      Summary: "Interactive prototype for physiotherapy slot selection"
    }
    ```
  - Use solid backgrounds (`bg-[#FBF7EF]` or `bg-[var(--background)]`) for standalone prototypes.

### 7.2 HTML Generative UI Boilerplate
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Allowlisted Google Antigravity gstatic Tailwind CDN -->
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-transparent text-[var(--foreground)] antialiased p-5">
  <div class="bg-[#FBF7EF] text-[#20291F] border border-[#E4DCC8] rounded-xl p-6 shadow-sm max-w-lg mx-auto">
    <div class="flex items-center justify-between pb-4 border-b border-[#E4DCC8]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-[#713917] flex items-center justify-center text-[#FFC200] font-bold text-sm">
          ☀
        </div>
        <div>
          <h2 class="text-[#713917] font-bold text-base leading-tight">Sunshine Physiotherapy</h2>
          <span class="text-[12px] text-[#5B6459]">Clinical Rehabilitation Center</span>
        </div>
      </div>
      <span class="px-2.5 py-1 bg-[#2E6B5E]/10 text-[#1F4C42] rounded-full text-xs font-medium">Rehabilitation Care</span>
    </div>
    <div class="py-4 space-y-3">
      <p class="text-[#5B6459] text-sm leading-relaxed">
        Personalized clinical assessment for musculoskeletal recovery.
      </p>
      <div class="p-3 bg-white rounded-lg border border-[#E4DCC8]">
        <span class="text-xs text-[#8C4600] font-medium">Clinical Focus:</span>
        <p class="text-sm text-[#20291F] font-medium mt-0.5">Lumbar Spine & Mobility Restoration</p>
      </div>
    </div>
    <button type="button" class="w-full min-h-[48px] bg-[#713917] text-white rounded-lg font-medium text-sm hover:bg-[#52270E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713917] focus-visible:ring-offset-2">
      Schedule Consultation
    </button>
  </div>
</body>
</html>
```

### 7.3 Visual Mockups via `generate_image`
- Utilize `generate_image` to explore visual compositions, hero imagery, anatomical illustrations, or layout explorations.
- **Tool Parameters & Schema Contracts**:
  - `ImageName`: All lowercase with underscores, maximum 3 words describing content (e.g., `hero_booking_mockup`, `spine_posture_diagram`, `triage_flow_mockup`).
  - `AspectRatio`: Choose from `'16:9'` (desktop hero), `'4:3'` or `'1:1'` (mobile cards/feature showcases), `'9:16'` (mobile screen flow).
  - `Prompt`: Describe the clinical interface, typography, and mood in detail.
- **Strict Anti-Device-Frame Rule**: When generating UI designs, generate **ONLY the interface itself** without surrounding device frames (laptops, phones, tablets, or browser frames) unless the user explicitly requests them. Incorporate generated visual assets directly into UI artifacts.

---

## 8. Dual-Stream Web & Mobile Design Cohesion

The Sunshine Physio monorepo powers both a Next.js web application (`apps/web`) and a React Native / Expo mobile application (`apps/expo`). Maintain strict cross-platform harmony while respecting platform conventions:

| Design Dimension | Web (`apps/web`) | Mobile (`apps/expo`) |
| :--- | :--- | :--- |
| **Framework & Styling** | Next.js App Router, Semantic HTML5, Tailwind CSS v4 (`@theme`) | Expo Router, React Native Primitives, StyleSheet / NativeWind |
| **Tokens Foundation** | `@sunshine/tokens` via `sunshineTailwindPreset` & TS tokens | `@sunshine/tokens` imported directly into styles/components |
| **Navigation & Modals** | Top navbar, responsive sidebar, native `<dialog>` / Popover API | Bottom tab bar, native stack header, bottom sheets |
| **Interaction Model** | Mouse hover (`@media (hover: hover)`), keyboard shortcuts | Touch gestures, swipe actions, physical haptics |
| **Layout Dynamics** | CSS Grid, Flexbox, Container Queries (`@container`) | Flexbox column-first, ScrollView, FlatList, Safe Area Insets |
| **Touch Ergonomics** | Interactive targets strictly $\ge 48$px (min 44px floor for dense desktop data grids) | Touch targets strictly $\ge 48$px, thumb-zone primary actions |
| **Viewport Testing** | 5 canonical viewports (360px, 390px, 768px, 1280px, 1920px) | iPhone & Android standard aspect ratios + safe areas |

### Key Cross-Platform Invariants
1. **Zero Token Duplication**: Never define duplicate color hexes or font sizes inside `apps/web` or `apps/expo`. Always import from `@sunshine/tokens`.
2. **Platform Sovereignty**: Never import web DOM globals (`document`, `window`) into `apps/expo`, and never use React Native native-only modules inside `apps/web`.
3. **Ergonomic Parity**: A patient transitioning from web to mobile must experience identical color semantics, typography hierarchy, and brand voice.

---

## 9. Concrete Self-Critique Checklist

Before presenting UI work or completing a frontend task, evaluate the implementation against this self-critique rubric:

- [ ] **Implementor Governance & Reading**: Did I explicitly read `.agents/skills/frontend-design/SKILL.md` via `view_file` before writing code? Did I record Pass 1 & Pass 2 in my task transcript?
- [ ] **Fast Iterative Verification**: Did I use `pnpm test:diff` and `pnpm --filter @sunshine/web typecheck` for inner-loop testing without running hanging monorepo sweeps?
- [ ] **Commit Hygiene**: Are all commits Conventional Commits with GPG signing (`-S`) using key `605C561448D10B4D4DFF1D1EE2B0F4C15711342F`?
- [ ] **Decluttered Booking Intake (`/book`)**:
  - [ ] Single-column triage intake implemented (Pain Category, Preferred Time Window, Name, BD Phone)?
  - [ ] Doctor selection panes, slot pickers, and specialist rosters completely eliminated from `/book`?
  - [ ] Optional `?specialist=<slug>` referral from `/team` renders only as a subtle 1-line preferred specialist note without browse panes?
- [ ] **Mobile-First Adaptive Spacing & Density**:
  - [ ] Mobile spacing tight and efficient (`p-3.5 gap-2.5 / py-6`), expanding at tablet (`p-5 gap-4 / py-10`) and desktop (`p-6 gap-6 / py-14`)?
  - [ ] Interactive touch target floor $\ge 48 \times 48$px strictly preserved across all mobile controls and buttons?
- [ ] **Macro-Level Restraint (Chanel Anchor)**:
  - [ ] Exactly one prominent primary CTA per section (Hero single CTA)?
  - [ ] Verbose service/condition card grids collapsed into scannable clinical accordions and chips, removing repetitive borders and AI template chrome?
  - [ ] Compact header chrome cluster for Branch Switcher and Language Toggle?
- [ ] **Two-Pass Process**: Did I complete Pass 1 (brainstorming palette, typography, ASCII wireframe/spatial layout) and Pass 2 (adversarial self-critique against the brief before authoring code)?
- [ ] **Subject Grounding**: Does the visual design distinctly reflect a clinical rehabilitation practice, or does it look like generic SaaS software?
- [ ] **AI Cliché Check**:
  - [ ] No cream + clay terracotta Anthropic tell (`#D97757` with editorial serif)? (Warm Mahogany `#713917` corporate grounding with sans-serif `Inter`/`Hind Siliguri` is verified and distinguished from the cliché)
  - [ ] No neon cybersecurity / pitch-black styling?
  - [ ] No SaaS card-kit homogeny or generic gradient washes?
  - [ ] No broadsheet newspaper layout with dense hairline columns?
  - [ ] No tracked-out ALL CAPS labels or arbitrary non-sequential numbered markers?
  - [ ] No single-word accents in headlines (e.g. single colored or italicized word)?
  - [ ] No unmotivated fade-up scroll animations or hover scale lifts?
- [ ] **Boldness Restraint & Chanel Heuristic**: Is boldness concentrated in one signature element, with clean, quiet, disciplined supporting structure? Did I remove at least one non-essential decorative element?
- [ ] **Modern Web Standards**: Did I query `modern-web-guidance` (`pnpx modern-web-guidance@latest search`) before writing custom CSS/JS for dialogs, popovers, or container queries?
- [ ] **Token Alignment**: Are all colors, typography, spacing, and radii sourced strictly from `@sunshine/tokens` (including Warm Mahogany `#713917` / `colors.brand.navy`, Botanical Teal `#2E6B5E`, and Sunshine Amber `#E2963A`)?
- [ ] **Generative UI Hygiene**:
  - [ ] Did HTML artifacts use the allowlisted gstatic Tailwind CDN (`https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js`) instead of CSP-blocked CDNs?
  - [ ] Did inline `<agent-embed>` widgets omit `min-h-screen`, `h-screen`, and `100vh` to avoid viewport collapse?
  - [ ] Did inline widgets stay under the 500px height budget with transparent root backgrounds?
  - [ ] Was the sub-12px micro-text ban respected (no `text-[10px]`, `text-[11px]`, or font sizes < 12px)?
- [ ] **Visual Mockups (`generate_image`)**:
  - [ ] Were UI designs generated without surrounding device frames (laptops, phones, tablets) unless requested?
  - [ ] Did `ImageName` conform to lowercase with underscores (max 3 words)?
- [ ] **Accessibility Compliance**:
  - [ ] Did I run `lighthouse_audit` or automated a11y testing with zero critical failures?
  - [ ] Accessible names on all controls (buttons, links, icon toggles with `aria-label`, no empty `name: ""` in `take_snapshot`)?
  - [ ] Form inputs properly associated with `<label>` tags (no orphaned inputs via `evaluate_script`)?
  - [ ] Body text contrast $\ge 4.5:1$ (WCAG AA) and large text $\ge 3:1$?
  - [ ] Warm Mahogany contrast $\ge 8.4:1$ on cream (`#713917` achieves $\sim 8.55:1$, WCAG AAA)?
  - [ ] Amber/colored text contrast $\ge 6.5:1$ (`colors.brand.amberText`)?
  - [ ] Interactive touch targets strictly $\ge 48 \times 48$px (min 44px floor for dense data grids) verified with `evaluate_script`?
  - [ ] Document-level checks passed via `evaluate_script` (`<html lang="...">`, `<title>`, no `user-scalable=no`, reduced motion)?
  - [ ] Visible, high-contrast keyboard focus rings and focus trapping on modals/dialogs?
  - [ ] Semantic HTML and ARIA landmark hierarchy without skipped heading levels?
- [ ] **Dual-Stream Cohesion, Viewports & Interactive Validation**:
  - [ ] Tested responsive breakpoints using `resize_page` matching `viewportPresets` (360px, 390px, 768px, 1280px, 1920px)?
  - [ ] Exercised live user journeys and verified visual state/DOM snapshots via `/browser`?
  - [ ] If web and mobile are affected, do they share coherent visual tokens and interaction expectations?
- [ ] **Copywriting Polish**: Is the interface copy written in active voice, patient-centric terms, with dignified errors and actionable empty states?

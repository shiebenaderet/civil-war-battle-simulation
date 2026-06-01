# Battle Journal Handout Page-Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all four printable Battle Journal handouts fill pages top-to-bottom with no large blank gaps and no boxes clipped across page breaks, while keeping fonts/content unchanged.

**Architecture:** CSS-only edits to four independent standalone HTML files. Remove `break-inside: avoid` from the whole-act container `.act-section` (the cause of whole-act page jumps) while keeping it on the atomic boxes; add `break-after: avoid` to headings; add a forced page break before the Part 2 section via a class on its `.page` wrapper.

**Tech Stack:** Vanilla HTML/CSS. Verification via headless Google Chrome (`--print-to-pdf`) + a Python/PyMuPDF pixel-row blank-space analyzer at `/tmp/handout-verify/analyze.py`.

---

## Verification tooling (already built, reused by every task)

`/tmp/handout-verify/analyze.py` renders each PDF page to pixels and reports, per page: ink top/bottom in inches, trailing blank space, and largest internal blank gap. It flags trailing > 1.5in on non-final pages and internal gaps > 1.0in. Render command:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=/tmp/handout-verify/AFTER-<name>.pdf \
  "file://$PWD/handouts/battle-journal-<name>.html" 2>/dev/null
python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-<name>.pdf
```

**Baseline captured (before any change), `some-support`:** 7 pages; page 1 trailing 7.78in (the screenshot gap); pages 2-5 trailing 1.6-3.5in; page 7 nearly empty.

**Pass criteria per file:**
- No non-final page has trailing blank > ~1.5in **except** the page that ends Part 1 right before the forced Part-2 break (one allowed seam).
- No internal blank gap > ~1.0in on any page.
- No `.battle-row` / `.reflect-box` / `.q-embed` / `.wordbank` clipped across a page edge (visual check of rendered PNGs).
- Page count is content-appropriate (most/more support ~3-4; standard/advanced ~4-5) and lower than or equal to the before-count where space was wasted.

---

## Task 1: Fix `some-support` (★★ More Support — the screenshot variant)

**Files:**
- Modify: `handouts/battle-journal-some-support.html` (the `@media print` block ~lines 229-267, the `.act-section` rule line 209, and the second `.page` wrapper line 448)

- [ ] **Step 1: Remove whole-act break-inside lock.** Change line 209 from
  `.act-section { margin: 12px 0; break-inside: avoid; page-break-inside: avoid; }`
  to
  `.act-section { margin: 12px 0; }`
  (Keeps margin; drops the avoid that forces whole acts to jump pages. The atoms `.battle-row`/`.reflect-box` keep their own `break-inside: avoid`, so they still never split.)

- [ ] **Step 2: Glue headings to their content.** In the `@media print` block, add a rule:

```css
.act-section-head, .section-head, .section-head h1 {
    break-after: avoid; page-break-after: avoid;
}
```

  Also add `break-inside: avoid;` to `.act-section-head` so the heading chip itself never splits. (Place near the existing `.section-head { margin-bottom: 6px; }` rule.)

- [ ] **Step 3: Force the Part 1 / Part 2 break.** Change the second page wrapper at line 448 from
  `<div class="page">`
  to
  `<div class="page page-break">`
  and add this CSS rule inside `@media print` (and harmlessly outside is fine too, but keep it print-scoped to avoid an on-screen blank band):

```css
@media print {
    .page-break { break-before: page; page-break-before: always; }
}
```

  If a `@media print` block already exists (it does), add the `.page-break` rule inside it rather than opening a new one.

- [ ] **Step 4: Render and analyze.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=/tmp/handout-verify/AFTER-some-support.pdf "file://$PWD/handouts/battle-journal-some-support.html" 2>/dev/null
python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-some-support.pdf
```

  Expected: page count drops from 7; page 1 trailing blank far below 7.78in (now filled through several battle rows); only the Part-1-final page may show notable trailing before the forced break; no internal gap > 1.0in.

- [ ] **Step 5: Visual spot-check.** Render pages to PNG and eyeball that no box is clipped at a page edge:

```bash
python3 -c "import fitz; d=fitz.open('/tmp/handout-verify/AFTER-some-support.pdf'); [d[i].get_pixmap(dpi=110).save(f'/tmp/handout-verify/after-some-p{i+1}.png') for i in range(d.page_count)]"
```

  Open the PNGs; confirm every battle row / reflection box / Q box sits wholly on one page and Part 2 starts at the top of its own page.

- [ ] **Step 6: Commit.**

```bash
git add handouts/battle-journal-some-support.html
git commit -m "Handout (More Support): greedy page flow, no wasted space"
```

---

## Task 2: Fix `extra-support` (★ Most Support)

**Files:**
- Modify: `handouts/battle-journal-extra-support.html` (its `.act-section` rule ~line 114, its `@media print` block ~lines 221-258, and its second `.page` wrapper)

Note: this variant has a 13pt print body and its own spacing values, but the same atom structure. Apply the identical three structural changes; do not touch its font/spacing numbers.

- [ ] **Step 1: Find the `.act-section` rule.** Run `grep -n "act-section {" handouts/battle-journal-extra-support.html` and remove `break-inside: avoid; page-break-inside: avoid;` from that rule, keeping its `margin`.

- [ ] **Step 2: Add heading-glue rule** inside its `@media print` block:

```css
.act-section-head, .section-head, .section-head h1 {
    break-after: avoid; page-break-after: avoid;
}
.act-section-head { break-inside: avoid; }
```

- [ ] **Step 3: Force Part 2 break.** Find the second `<div class="page">` (run `grep -n 'class="page"' handouts/battle-journal-extra-support.html`; the second match) and change it to `<div class="page page-break">`. Add inside `@media print`:

```css
.page-break { break-before: page; page-break-before: always; }
```

- [ ] **Step 4: Render and analyze.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=/tmp/handout-verify/AFTER-extra-support.pdf "file://$PWD/handouts/battle-journal-extra-support.html" 2>/dev/null
python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-extra-support.pdf
```

  Expected: no non-final-before-break page with trailing > 1.5in; no internal gap > 1.0in.

- [ ] **Step 5: Commit.**

```bash
git add handouts/battle-journal-extra-support.html
git commit -m "Handout (Most Support): greedy page flow, no wasted space"
```

---

## Task 3: Fix `standard` (★★★ Standard)

**Files:**
- Modify: `handouts/battle-journal-standard.html`

This variant has 13 battle rows (one per battle, not two-per-act), so it is the densest of the journal-style layouts. Same three changes.

- [ ] **Step 1:** `grep -n "act-section {" handouts/battle-journal-standard.html` and remove the `break-inside: avoid; page-break-inside: avoid;` from that rule (keep margin).

- [ ] **Step 2:** Add inside its `@media print` block:

```css
.act-section-head, .section-head, .section-head h1 {
    break-after: avoid; page-break-after: avoid;
}
.act-section-head { break-inside: avoid; }
```

- [ ] **Step 3:** `grep -n 'class="page"' handouts/battle-journal-standard.html`; change the second match to `<div class="page page-break">`. Add inside `@media print`:

```css
.page-break { break-before: page; page-break-before: always; }
```

- [ ] **Step 4: Render and analyze.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=/tmp/handout-verify/AFTER-standard.pdf "file://$PWD/handouts/battle-journal-standard.html" 2>/dev/null
python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-standard.pdf
```

- [ ] **Step 5: Commit.**

```bash
git add handouts/battle-journal-standard.html
git commit -m "Handout (Standard): greedy page flow, no wasted space"
```

---

## Task 4: Fix `advanced` (★★★★ Extra Challenge — densest variant)

**Files:**
- Modify: `handouts/battle-journal-advanced.html`

Most content (13 battle rows + extra challenge prompts). Same three changes. This is the variant to scrutinize hardest in the visual check because it has the most page breaks.

- [ ] **Step 1:** `grep -n "act-section {" handouts/battle-journal-advanced.html` and remove `break-inside: avoid; page-break-inside: avoid;` from that rule (keep margin). If this file does not use `.act-section` (verify the grep), instead locate the per-act container class it does use and remove the avoid from that container only, leaving the atomic boxes' avoid intact.

- [ ] **Step 2:** Add inside its `@media print` block:

```css
.act-section-head, .section-head, .section-head h1 {
    break-after: avoid; page-break-after: avoid;
}
.act-section-head { break-inside: avoid; }
```

- [ ] **Step 3:** `grep -n 'class="page"' handouts/battle-journal-advanced.html`; change the second match to `<div class="page page-break">`. Add inside `@media print`:

```css
.page-break { break-before: page; page-break-before: always; }
```

- [ ] **Step 4: Render and analyze.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=/tmp/handout-verify/AFTER-advanced.pdf "file://$PWD/handouts/battle-journal-advanced.html" 2>/dev/null
python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-advanced.pdf
python3 -c "import fitz; d=fitz.open('/tmp/handout-verify/AFTER-advanced.pdf'); [d[i].get_pixmap(dpi=110).save(f'/tmp/handout-verify/after-advanced-p{i+1}.png') for i in range(d.page_count)]"
```

- [ ] **Step 5: Commit.**

```bash
git add handouts/battle-journal-advanced.html
git commit -m "Handout (Extra Challenge): greedy page flow, no wasted space"
```

---

## Task 5: Cross-variant final verification

- [ ] **Step 1: Re-render all four and print the summary table.**

```bash
cd /Users/shiebenaderet/Documents/GitHub/civil-war-battle-simulation
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for n in extra-support some-support standard advanced; do
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=/tmp/handout-verify/AFTER-$n.pdf "file://$PWD/handouts/battle-journal-$n.html" 2>/dev/null
  python3 /tmp/handout-verify/analyze.py /tmp/handout-verify/AFTER-$n.pdf
done
```

  Confirm all four pass the criteria. Note any page that legitimately ends Part 1 short right before the forced Part-2 break (one allowed seam per file).

- [ ] **Step 2: Present before/after to the user** for the More Support variant (screenshot match) and the Extra Challenge variant (densest). Provide page-count delta and per-page trailing/gap numbers.

---

## Self-review notes

- **Spec coverage:** All four CSS changes from the spec map to tasks (change 1 → Step 1 each; change 2 → Step 2 each; change 3 → Step 3 each; change 4 "keep `.foot` hidden" requires no edit, covered by not touching it). Verification section → Tasks' Step 4/5 and Task 5. ✓
- **No placeholders:** every step shows exact CSS/commands. ✓
- **Consistency:** class name `.page-break` and rule `break-before: page; page-break-before: always;` identical across all four tasks. ✓
- **Risk note:** Task 4 Step 1 guards against `advanced` using a different container class name; verify with grep before editing.

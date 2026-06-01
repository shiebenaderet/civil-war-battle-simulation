# Smart Page Flow for Battle Journal Handouts

Date: 2026-05-31
Status: Approved, pre-implementation

## Problem

The four printable Battle Journal handouts waste large amounts of vertical
space when printed or saved to PDF. In the screenshot the user provided (the
More Support / `some-support` variant), page 1 holds only the intro and Act I,
then breaks early, leaving roughly half the page blank before the remaining
acts crowd onto later pages.

### Root cause

Every block is marked `break-inside: avoid`, including the `.act-section`
container that wraps a whole act (two-plus battle rows + the act reflection
box). When a full act will not fit in the space left on the current page, the
browser pushes the entire act to the next page rather than splitting it. The
last act that does not fit leaves a tall blank gap behind it. There is also no
forced break between Part 1 (battle log) and Part 2 (final essay), so the seam
location is incidental.

Affected files (all four, same root cause):
- `handouts/battle-journal-extra-support.html`  (★ Most Support)
- `handouts/battle-journal-some-support.html`   (★★ More Support — screenshot)
- `handouts/battle-journal-standard.html`        (★★★ Standard)
- `handouts/battle-journal-advanced.html`        (★★★★ Extra Challenge)

## Goal

Pages fill top-to-bottom with no large blank gaps, and no single box is ever
clipped across a page boundary. **Page count is whatever the content honestly
needs** (typically 2–3 pages per variant). No usability sacrifice: font sizes
and writing-line heights are unchanged. The design is *not* forced onto a fixed
number of pages — the user confirmed these cannot fit one double-sided sheet
without becoming unusable, and that multiple pages are fine as long as space is
not wasted.

## Approach: greedy fill, clean seams

Let the browser break *between* the atoms inside an act (after a battle row,
before the reflection box) while still never splitting a single atom. This
fills each page completely and breaks only at sensible seams.

### CSS changes (applied identically to all four files)

1. **Unlock the act container.** Remove `break-inside: avoid` /
   `page-break-inside: avoid` from `.act-section`. This is the single change
   that eliminates the whole-act jump. Keep `break-inside: avoid` on the atoms
   that should never split: `.battle-row`, `.reflect-box`, `.q-embed`,
   `.wordbank`, `.pat-list`, `.act-box`, `.annot`.

2. **Protect headings from orphaning.** Add `break-after: avoid` (+
   `page-break-after: avoid` for older engines) to `.act-section-head` and
   `.section-head` so an act/section title never strands alone at the bottom of
   a page; it stays glued to the first box beneath it.

3. **Force the Part 1 / Part 2 seam.** Add `break-before: page` (+
   `page-break-before: always`) to the second `.page` wrapper (the "How Did the
   Union Win?" / Part 2 section) so Part 2 always starts at the top of a fresh
   page. This is the one intentional hard break. Implemented via a dedicated
   class (e.g. `.page.page-break`) added to the second wrapper in each file, so
   the rule only fires where intended.

4. **Keep the existing `.foot { display: none }` print rule.** The manual
   "CONTINUED BELOW" footer is already hidden in print; the forced break in (3)
   replaces its purpose. No new logic needed.

### What is explicitly NOT changing

- No font-size, line-height, or `.lineW` height changes.
- No content edits (battles, prompts, word bank, reflection questions).
- No change to the on-screen (non-print) appearance beyond the forced Part-2
  page start, which is desirable on screen too.
- The `extra-support` variant uses a 13pt print body and slightly different
  spacing; its atom set is the same, so the same four changes apply. Variant
  differences are in spacing values, not structure.

## Verification

Render each of the four handouts to PDF with headless Chrome and confirm:
- (a) No blank gap taller than ~1 inch except at the forced Part-1/Part-2 break.
- (b) No box clipped at a page edge (every `.battle-row` / `.reflect-box` /
  `.q-embed` / `.wordbank` is wholly on one page).
- (c) Page count is reasonable (2–3 per variant) and consistent with content
  volume (standard/advanced have more battle rows than most/more support).

Show the user before/after page images for at least the More Support variant
(the one in the screenshot) and the most content-dense variant (advanced).

## Risk

Low. These are static, standalone HTML files opened in a new tab; the print
output is governed entirely by their own `@media print` CSS. Changes are
additive/subtractive CSS rules with no JavaScript and no shared dependencies.
Each file is independent, so a mistake in one cannot affect another.

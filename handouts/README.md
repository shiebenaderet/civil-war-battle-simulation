# Battle Journal Handouts

Four reading-level tiers of the printable Battle Journal. Each tier is a
standalone HTML file plus a pre-rendered PDF that the on-page **Download PDF**
button links to.

| Tier | HTML | PDF | Pages |
|------|------|-----|-------|
| ★ Most Support     | `battle-journal-extra-support.html` | `battle-journal-extra-support.pdf` | 5 |
| ★★ More Support    | `battle-journal-some-support.html`  | `battle-journal-some-support.pdf`  | 6 |
| ★★★ Standard       | `battle-journal-standard.html`      | `battle-journal-standard.pdf`      | 6 |
| ★★★★ Extra Challenge | `battle-journal-advanced.html`      | `battle-journal-advanced.pdf`      | 6 |

## IMPORTANT: the PDFs are static snapshots — regenerate them after editing HTML

The **Download PDF** button serves the committed `.pdf` file, NOT a live render
of the HTML. If you edit a handout's HTML (text, layout, page flow) and do not
regenerate its PDF, the Download button will hand students the OLD version while
the on-screen page and Print button show the new one. Always regenerate after
editing.

### Why a static PDF instead of letting the browser print?

Browsers add headers/footers (URL, page number, title, date) to any printed
webpage, and a page cannot turn those off — it is a browser-dialog checkbox
("Headers and footers"). The static PDFs are rendered with that suppressed, so
students get a clean letter-size file without touching the print dialog.

## How to regenerate the PDFs

Requires Google Chrome. Run from the repo root:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for n in extra-support some-support standard advanced; do
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="handouts/battle-journal-$n.pdf" \
    "file://$PWD/handouts/battle-journal-$n.html"
done
```

The `--no-pdf-header-footer` flag is what strips the browser chrome (URL / title
/ date / page number). The `@page { size: letter portrait; margin: 0.4in }` rule
inside each HTML controls the content margins and page size.

After regenerating, commit the updated `.pdf` files alongside the `.html`
changes so the live site (GitHub `main`) serves the new version:

```bash
git add handouts/battle-journal-*.html handouts/battle-journal-*.pdf
git commit -m "Handouts: <what changed> + regenerate PDFs"
git push
```

## Verifying a regenerated PDF is clean (optional)

If you have Python with PyMuPDF (`pip install pymupdf`), this confirms there are
no header/footer artifacts and the page size is correct:

```bash
python3 -c "
import fitz
d = fitz.open('handouts/battle-journal-extra-support.pdf')
p1 = d[0].get_text()
bad = [k for k in ['file://','http','of 6','/ 6'] if k in p1]
print('artifacts:', bad or 'NONE'); print('size:', d[0].rect.width/72, 'x', d[0].rect.height/72, 'in')
print('first line:', p1.strip().splitlines()[0])
"
```

Expect `artifacts: NONE`, `size: 8.5 x 11.0 in`, and the first line to be the
handout's own tier header (e.g. `★ · MOST SUPPORT`).

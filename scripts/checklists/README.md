# Document-checklist PDFs

Generates every `public/checklists/*-checklist.pdf` (the files the "Download checklist"
forms hand out).

    pip install reportlab pypdf pillow
    python scripts/checklists/build.py              # rebuild all 58
    python scripts/checklists/build.py home-loan    # only names containing "home-loan"

- `data_loans.py`    — loan checklist content (the Word files' wording) and which products share a list
- `data_ca_legal.py` — CA & legal service checklists
- `render.py`        — the look: a small table per section (Document | Details)
- `build.py`         — picks the roomiest layout that still fits one page

Each section is a table. Put an item's specifics in the Details column with ` || `:

    "Salary slips || Latest 4 months"
    "ITR || Last 2 years | If income is taxable"
    "Shop Act licence, GST certificate || tag:Proprietor"

Details become thin outlined tags: periods (gold), "If ..." conditions (grey), "... required"
(navy), `tag:` (gold). Item prefixes: `!` bold, `*` note, `-` bullet, `## ` sub-heading.
A section whose items have no details just shows the Document column.

Lists use one full-width column when they fit a page that way, otherwise two columns (and a
slightly smaller type size if needed). Education Loan adds a separate one-page details sheet.

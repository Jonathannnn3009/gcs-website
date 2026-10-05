# Document-checklist PDFs

Generates every `public/checklists/*-checklist.pdf` (the files the "Download checklist"
forms hand out).

    pip install reportlab pypdf pillow
    python scripts/checklists/build.py              # rebuild all 58
    python scripts/checklists/build.py home-loan    # only names containing "home-loan"

- `data_loans.py`    — loan checklist content (the Word files' wording) and which products share a list
- `data_ca_legal.py` — CA & legal service checklists
- `render.py`        — the look: header, section bars, checkboxes, highlight boxes, fill-in forms

Important details inside an item are boxed automatically — numbers/periods ("4 months"),
conditions ("if applicable", "in case of ..."), "(require ...)" proofs, and form names
(Form 16, GSTR 3B). Item prefixes: `!` bold, `*` note, `-` bullet, `## ` sub-heading,
`[[Tag]]` a coloured tag at the start.

The loan lists use two columns so each one fits a single page; the Education Loan list adds one
separate page for its fill-in Customer Details Sheet.

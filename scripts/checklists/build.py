"""Build every document-checklist PDF into public/checklists.

    python scripts/checklists/build.py            # build all
    python scripts/checklists/build.py home-loan  # build only names containing "home-loan"

Needs: reportlab, pypdf.  Content lives in data_loans.py / data_ca_legal.py,
the look in render.py.
"""

import os
import re
import shutil
import sys

from pypdf import PdfReader

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data_ca_legal import SERVICES  # noqa: E402
from data_loans import COPIES, LOAN_CHECKLISTS  # noqa: E402
from render import build_pdf  # noqa: E402

OUT_DIR = os.environ.get("CHECKLIST_OUT") or os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "checklists")
)
os.makedirs(OUT_DIR, exist_ok=True)
only = sys.argv[1] if len(sys.argv) > 1 else ""


def path_for(slug):
    return os.path.join(OUT_DIR, f"{slug}-checklist.pdf")


def pages_of(slug):
    return len(PdfReader(path_for(slug)).pages)


# Try the most spacious layout first; only squeeze when a list won't fit one page.
ATTEMPTS = [(1, 8.6), (2, 8.0), (2, 7.6), (2, 7.2), (2, 6.9)]


def build_fitting(slug, title, sections, subtitle=None):
    allowed = 2 if any("form" in s for s in sections) else 1  # a fill-in sheet gets its own page
    for columns, size in ATTEMPTS:
        build_pdf(path_for(slug), title, sections, subtitle=subtitle, columns=columns, size=size)
        if pages_of(slug) <= allowed:
            return columns, size
    return columns, size  # best effort


def split_condition(text):
    """'Proofs, if applicable' -> 'Proofs || If applicable' so conditions land in the Details column."""
    m = re.match(r"^(.*?),\s*((?:if|where)\b.*)$", text, re.I)
    if m:
        cond = m.group(2)
        return f"{m.group(1)} || {cond[0].upper()}{cond[1:]}"
    return text


built = []
layouts = {}

# ── loan products ─────────────────────────────────────────────────────────
for slug, spec in LOAN_CHECKLISTS.items():
    if only and only not in slug:
        continue
    layouts[slug] = build_fitting(slug, spec["title"], spec["sections"], spec.get("subtitle"))
    built.append(slug)
    for copy in COPIES.get(slug, []):
        shutil.copyfile(path_for(slug), path_for(copy))
        built.append(copy)

# ── CA & legal services ───────────────────────────────────────────────────
for slug, title, division, documents in SERVICES:
    if only and only not in slug:
        continue
    associate = "our CA Services team" if division == "CA Services" else "Sheetal Associates"
    sections = [
        {
            "callout": f"<b>Handled through {associate}.</b> This service is arranged through our associated "
            "professionals, who handle the work through their own professional process. Requirements, "
            "documentation and timelines vary case to case."
        },
        {"title": "Documents Typically Required", "items": [split_condition(d) for d in documents]},
    ]
    build_pdf(path_for(slug), title, sections, subtitle="Document checklist for this service.")
    built.append(slug)

print(f"\nBuilt {len(built)} PDFs into {OUT_DIR}\n")
for slug in built:
    pages = pages_of(slug)
    lay = layouts.get(slug)
    extra = f"  [{lay[0]} col, {lay[1]}pt]" if lay else ""
    print(f"  {slug}-checklist.pdf  {pages} page{'s' if pages != 1 else ''}{extra}")

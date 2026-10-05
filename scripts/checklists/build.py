"""Build every document-checklist PDF into public/checklists.

    python scripts/checklists/build.py            # build all
    python scripts/checklists/build.py home-loan  # build only names containing "home-loan"

Needs: reportlab, pypdf.  Content lives in data_loans.py / data_ca_legal.py,
the look in render.py.
"""

import os
import shutil
import sys

from pypdf import PdfReader

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data_ca_legal import SERVICES  # noqa: E402
from data_loans import COPIES, LOAN_CHECKLISTS  # noqa: E402
from render import CONTENT_W, build_pdf  # noqa: E402

OUT_DIR = os.environ.get("CHECKLIST_OUT") or os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "checklists")
)
os.makedirs(OUT_DIR, exist_ok=True)
only = sys.argv[1] if len(sys.argv) > 1 else ""


def path_for(slug):
    return os.path.join(OUT_DIR, f"{slug}-checklist.pdf")


built = []

# ── loan products ─────────────────────────────────────────────────────────
for slug, spec in LOAN_CHECKLISTS.items():
    if only and only not in slug:
        continue
    build_pdf(path_for(slug), spec["title"], spec["sections"], subtitle=spec.get("subtitle"), columns=2)
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
        {"title": "Documents Typically Required", "items": list(documents)},
    ]
    build_pdf(path_for(slug), title, sections, subtitle="Document checklist for this service.")
    built.append(slug)

print(f"\nBuilt {len(built)} PDFs into {OUT_DIR}\n")
for slug in built:
    pages = len(PdfReader(path_for(slug)).pages)
    print(f"  {slug}-checklist.pdf  {pages} page{'s' if pages != 1 else ''}")

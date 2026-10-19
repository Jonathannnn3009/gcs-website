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
from data_ca_legal_detail import DETAIL  # noqa: E402
import json  # noqa: E402
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
ATTEMPTS = [(1, 8.6), (2, 8.0), (2, 7.8), (2, 7.6), (2, 7.4), (2, 7.2), (2, 6.9)]


def build_fitting(slug, title, sections, subtitle=None, pages=1):
    allowed = max(pages, 2 if any("form" in s for s in sections) else 1)  # a fill-in sheet gets its own page
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


# Lists that run over more than one page
LONGER = {"project-funding": 3, "loan-against-securities": 2, "private-funding": 2}

built = []
layouts = {}

# ── loan products ─────────────────────────────────────────────────────────
for slug, spec in LOAN_CHECKLISTS.items():
    if only and only not in slug:
        continue
    layouts[slug] = build_fitting(
        slug, spec["title"], spec["sections"], spec.get("subtitle"), pages=LONGER.get(slug, 1)
    )
    built.append(slug)
    for copy in COPIES.get(slug, []):
        shutil.copyfile(path_for(slug), path_for(copy))
        built.append(copy)

# Services whose page shows only the common documents keep the complete list for this download.
# The groups come from src/data/professional-services.ts (run export-full-groups.mts to refresh).
FULL_GROUPS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "full-document-groups.json")
FULL_GROUPS = json.load(open(FULL_GROUPS_FILE)) if os.path.exists(FULL_GROUPS_FILE) else {}


def full_sections(groups):
    out = []
    for g in groups:
        items = [split_condition(i) for i in g["items"]]
        if g.get("after"):
            items.append("*" + g["after"])  # a note line closing the section
        sec = {"title": g["title"], "items": items}
        if g.get("intro"):
            sec["note"] = g["intro"]
        out.append(sec)
    return out


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
    if slug in DETAIL:
        sections = sections[:1] + DETAIL[slug]
        layouts[slug] = build_fitting(slug, title, sections, "Document checklist for this service.", pages=2)
    elif slug in FULL_GROUPS:
        sections = sections[:1] + [
            {"callout": "The exact documents depend on your income sources. <b>You only need to provide the "
             "documents that apply to you.</b> Additional documents may be asked for after your case is reviewed."}
        ] + full_sections(FULL_GROUPS[slug])
        layouts[slug] = build_fitting(slug, title, sections, "Complete document checklist.", pages=3)
    else:
        build_pdf(path_for(slug), title, sections, subtitle="Document checklist for this service.")
    built.append(slug)

print(f"\nBuilt {len(built)} PDFs into {OUT_DIR}\n")
for slug in built:
    pages = pages_of(slug)
    lay = layouts.get(slug)
    extra = f"  [{lay[0]} col, {lay[1]}pt]" if lay else ""
    print(f"  {slug}-checklist.pdf  {pages} page{'s' if pages != 1 else ''}{extra}")

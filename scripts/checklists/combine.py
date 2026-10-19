"""Join every checklist into one PDF with a cover, a contents page and bookmarks.

    python scripts/checklists/combine.py [output.pdf]

Each list appears once (products that share a list, such as the car loans, are not repeated).
Run build.py first so public/checklists is current.
"""

import io
import os
import sys

from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data_ca_legal import SERVICES  # noqa: E402
from data_loans import LOAN_CHECKLISTS  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, "..", "..", "public", "checklists"))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.normpath(
    os.path.join(HERE, "..", "..", "..", "GCS-Document-Checklists-All.pdf")
)
NAVY = (0.043, 0.094, 0.286)
GOLD = (0.74, 0.55, 0.12)

entries = []  # (group, title, path)
for slug, spec in LOAN_CHECKLISTS.items():
    entries.append(("Loans", spec["title"], os.path.join(SRC, f"{slug}-checklist.pdf")))
for slug, title, division, _ in SERVICES:
    group = "CA Services" if division == "CA Services" else "Legal Services"
    entries.append((group, title, os.path.join(SRC, f"{slug}-checklist.pdf")))

counts = [len(PdfReader(p).pages) for _, _, p in entries]


def cover_and_contents(first_pages):
    """Cover page, then the contents; first_pages[i] is the page each list starts on."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    w, h = A4
    c.setFillColorRGB(*NAVY)
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColorRGB(*GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(w / 2, h - 70 * mm, "G R O W T H   C A P I T A L   S E R V I C E S")
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Times-Bold", 34)
    c.drawCentredString(w / 2, h / 2 + 12 * mm, "Document Checklists")
    c.setFont("Helvetica", 13)
    c.drawCentredString(w / 2, h / 2 - 2 * mm, "Loans, CA services and legal services")
    c.setFillColorRGB(*GOLD)
    c.setFont("Helvetica", 10)
    c.drawCentredString(w / 2, 30 * mm, "+91 88280 01700  |  +91 88280 03900  |  growthcs17@gmail.com")
    c.setFillColorRGB(0.8, 0.82, 0.9)
    c.setFont("Helvetica", 8)
    c.drawCentredString(w / 2, 22 * mm, "Indicative lists. Our team confirms the exact papers for your case.")
    c.showPage()

    y = h - 28 * mm
    page_open = False

    def heading():
        nonlocal y
        c.setFillColorRGB(*NAVY)
        c.setFont("Times-Bold", 22)
        c.drawString(22 * mm, h - 24 * mm, "Contents")
        c.setStrokeColorRGB(*GOLD)
        c.setLineWidth(1.2)
        c.line(22 * mm, h - 27 * mm, 52 * mm, h - 27 * mm)
        y = h - 40 * mm

    heading()
    last_group = None
    for (group, title, _), start in zip(entries, first_pages):
        need = 7 * mm + (9 * mm if group != last_group else 0)
        if y - need < 18 * mm:
            c.showPage()
            heading()
            last_group = None
        if group != last_group:
            y -= 3 * mm
            c.setFillColorRGB(*GOLD)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(22 * mm, y, group.upper())
            y -= 6 * mm
            last_group = group
        c.setFillColorRGB(0.1, 0.12, 0.2)
        c.setFont("Helvetica", 10)
        c.drawString(26 * mm, y, title)
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(w - 22 * mm, y, str(start))
        y -= 7 * mm
    c.showPage()
    c.save()
    buf.seek(0)
    return PdfReader(buf)


# Two passes: the contents length decides the first page of each list.
front = cover_and_contents([1] * len(entries))
n_front = len(front.pages)
starts, page = [], n_front + 1
for n in counts:
    starts.append(page)
    page += n
front = cover_and_contents(starts)

writer = PdfWriter()
for p in front.pages:
    writer.add_page(p)
parents = {}
for (group, title, path), start in zip(entries, starts):
    for p in PdfReader(path).pages:
        writer.add_page(p)
    if group not in parents:
        parents[group] = writer.add_outline_item(group, start - 1)
    writer.add_outline_item(title, start - 1, parent=parents[group])
writer.add_metadata({"/Title": "Growth Capital Services — Document Checklists", "/Author": "Growth Capital Services"})
with open(OUT, "wb") as f:
    writer.write(f)
print(f"{len(entries)} checklists, {page - 1} pages -> {OUT}")

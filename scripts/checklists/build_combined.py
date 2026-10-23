"""One PDF with every document checklist: cover, contents, then each checklist in turn.

    python scripts/checklists/build_combined.py [output.pdf]

Reads the finished files in public/checklists (run build.py first if the data changed). A checklist
that several products share (for example the Car Loan list) appears once, with the products named.
"""

import io
import os
import sys

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data_ca_legal import SERVICES  # noqa: E402
from data_loans import COPIES, LOAN_CHECKLISTS  # noqa: E402

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
SRC = os.path.join(ROOT, "public", "checklists")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "docs", "GCS-Document-Checklists.pdf")

NAVY, GOLD, INK, MUTED = HexColor("#0f1b3d"), HexColor("#c9971c"), HexColor("#111827"), HexColor("#6b7280")
W, H = A4

PRODUCT_NAMES = {
    "dlod": "Drop-Line Overdraft (Secured)",
    "loan-against-property": "Loan Against Property",
    "car-refinance": "Car Refinance",
    "new-car-loan": "New Car Loan",
    "used-car-loan": "Used Car Loan",
    "bank-guarantee": "Bank Guarantee",
    "cash-credit": "Cash Credit",
    "letter-of-credit": "Letter of Credit",
    "overdraft-limit": "Overdraft Limit",
    "bill-discounting": "Bill Discounting",
    "working-capital-term-loan": "Working Capital Term Loan",
}

# (group heading, [(slug, title, [other products that use the same list])])
groups = [
    (
        "Loan checklists",
        [(s, spec["title"], [PRODUCT_NAMES.get(c, c.replace("-", " ").title()) for c in COPIES.get(s, [])]) for s, spec in LOAN_CHECKLISTS.items()],
    ),
    ("CA services checklists", [(s, t, []) for s, t, d, _ in SERVICES if d == "CA Services"]),
    ("Legal services checklists", [(s, t, []) for s, t, d, _ in SERVICES if d != "CA Services"]),
]

entries = []  # (group, slug, title, also, first_page, pages)
page = 0
readers = {}
for gname, items in groups:
    for slug, title, also in items:
        r = PdfReader(os.path.join(SRC, f"{slug}-checklist.pdf"))
        readers[slug] = r
        entries.append([gname, slug, title, also, page, len(r.pages)])
        page += len(r.pages)
total_body = page

ROW_H, TOP = 17, H - 130
rows_per_page = int((TOP - 60) / ROW_H)


def contents_pages():
    # lines: ("head", text) or ("item", n, title, also, page)
    lines, last, n = [], None, 0
    for g, slug, title, also, first, pages in entries:
        if g != last:
            lines.append(("head", g))
            last = g
        n += 1
        lines.append(("item", n, title, also, first, pages))
    pages_ = [[]]
    for ln in lines:
        need = 1 if ln[0] == "head" else (2 if ln[3] else 1)
        used = sum(1 if x[0] == "head" else (2 if x[3] else 1) for x in pages_[-1])
        if used + need > rows_per_page - 1:
            pages_.append([])
        pages_[-1].append(ln)
    return pages_


c_pages = contents_pages()
front = 1 + len(c_pages)  # cover + contents


def draw_cover(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(60, H - 250, 70, 4, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Times-Bold", 34)
    c.drawString(60, H - 300, "Document Checklists")
    c.setFont("Helvetica", 14)
    c.setFillColor(HexColor("#d9deea"))
    c.drawString(60, H - 330, "Everything you need to keep ready, loan by loan and service by service.")
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(GOLD)
    c.drawString(60, 150, "GROWTH CAPITAL SERVICES")
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#d9deea"))
    c.drawString(60, 130, "Your growth, our financial expertise")
    c.drawString(60, 108, "+91 88280 01700   |   +91 88280 03900   |   growthcs17@gmail.com")
    c.setFont("Helvetica-Oblique", 8.5)
    c.drawString(60, 70, "A guide to the documents usually asked for. Your expert will confirm exactly what applies to your case.")
    c.showPage()


def draw_contents(c, lines, pageno, of):
    c.setFillColor(NAVY)
    c.setFont("Times-Bold", 24)
    c.drawString(50, H - 70, "Contents")
    c.setFillColor(GOLD)
    c.rect(50, H - 80, 46, 3, fill=1, stroke=0)
    y = TOP
    for ln in lines:
        if ln[0] == "head":
            y -= 6
            c.setFillColor(GOLD)
            c.setFont("Helvetica-Bold", 9.5)
            c.drawString(50, y, ln[1].upper())
            c.setStrokeColor(HexColor("#e5e7eb"))
            c.line(50, y - 5, W - 50, y - 5)
            y -= ROW_H
            continue
        _, n, title, also, first, pages = ln
        pg = front + first + 1
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawString(50, y, f"{n:02d}")
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(80, y, title)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(W - 50, y, str(pg))
        if also:
            c.setFillColor(MUTED)
            c.setFont("Helvetica-Oblique", 8.5)
            words, lines_, cur = ("Also used for: " + ", ".join(also)).split(" "), [], ""
            for wd in words:
                t = (cur + " " + wd).strip()
                if c.stringWidth(t, "Helvetica-Oblique", 8.5) > W - 160 and cur:
                    lines_.append(cur)
                    cur = wd
                else:
                    cur = t
            lines_.append(cur)
            for ln_ in lines_:
                c.drawString(80, y - 11, ln_)
                y -= 11
        y -= ROW_H
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawCentredString(W / 2, 30, f"Growth Capital Services  |  Contents {pageno} of {of}")
    c.showPage()


buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
draw_cover(c)
for i, lines in enumerate(c_pages, 1):
    draw_contents(c, lines, i, len(c_pages))
c.save()
buf.seek(0)

w = PdfWriter()
for p in PdfReader(buf).pages:
    w.add_page(p)
w.add_outline_item("Contents", 1)
current_group = None
group_parent = None
for g, slug, title, also, first, pages in entries:
    start = len(w.pages)
    for p in readers[slug].pages:
        w.add_page(p)
    if g != current_group:
        group_parent = w.add_outline_item(g, start)
        current_group = g
    w.add_outline_item(title, start, parent=group_parent)
w.add_metadata({"/Title": "GCS Document Checklists", "/Author": "Growth Capital Services"})
w.page_mode = "/UseOutlines"
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "wb") as f:
    w.write(f)
print(f"{OUT}: {len(w.pages)} pages, {len(entries)} checklists ({front} front pages)")

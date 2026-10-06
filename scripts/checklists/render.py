"""Renderer for the branded document-checklist PDFs — a quiet, minimal table.

Each section is a small table:   [ ]  Document  |  Details

An item is a plain string. Put the specifics in the Details column with " || ":

    "Salary slips || Latest 4 months"
    "ITR || Last 2 years | If income is taxable"
    "Shop Act licence, Udyam certificate || tag:Proprietor"

Details are drawn as thin outlined tags: numbers/periods (gold), "If ..." conditions (grey),
"... required" (navy), and anything with a "tag:" prefix (gold, for business types).
Anything left in the document text is still picked out inline (e.g. a mid-sentence "(if applicable)",
form names in bold).

Item prefixes:  "!" bold item, "*" italic note (no checkbox), "-" bullet, "## " sub-heading.
"""

import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.platypus import (
    BaseDocTemplate,
    CondPageBreak,
    Flowable,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

NAVY = colors.HexColor("#0B1849")
NAVY_DEEP = colors.HexColor("#071230")
NUM_COLOR = colors.HexColor("#A9812A")
GOLD = colors.HexColor("#C8952A")
INK = colors.HexColor("#222936")
MUTED = colors.HexColor("#6B7280")
FAINT = colors.HexColor("#9AA1AE")
HAIR = colors.HexColor("#E4E1D8")
ROW_LINE = colors.HexColor("#ECE9E0")
BOX_LINE = colors.HexColor("#8A93A6")
FIELD_LINE = colors.HexColor("#BFC5D2")

PAGE_W, PAGE_H = A4
SPINE_W = 2.4 * mm
MARGIN_L = 16 * mm
MARGIN_R = 14 * mm
CONTENT_X = SPINE_W + MARGIN_L
CONTENT_W = PAGE_W - CONTENT_X - MARGIN_R

LOGO_PATH = r"D:\CRM WEBSITE - GCS\secure-sums-site\public\brand\gcs-lockup.png"
LOGO_RATIO = 545 / 870  # height / width

PHONE = "+91 88280 01700"
EMAIL = "growthcs17@gmail.com"
FOOTER_NOTE = (
    "Send clear photos or scans of the documents that apply to you on WhatsApp. "
    "Indicative list — our team will confirm before login."
)

# ── tags ──────────────────────────────────────────────────────────────────
CHIP = {
    "num": dict(fill="#FBF5E3", stroke="#DDC27A", color="#071230", scale=1.0, upper=False),
    "if": dict(fill=None, stroke="#AEB6CB", color="#4B5675", scale=0.8, upper=True),
    "req": dict(fill=None, stroke="#0B1849", color="#0B1849", scale=0.8, upper=True),
    "tag": dict(fill=None, stroke="#C8952A", color="#8F6A14", scale=0.8, upper=True),
}
CHIP_FONT = "Helvetica-Bold"

CHIP_RE = re.compile(
    r"""
      (?P<req>\(\s*require[sd]?\s+(?P<reqtxt>[^)]*)\))
    | \(\s*(?P<ifp>(?:if|in\s+case)\b[^)]*)\)
    | (?P<ifn>\b(?:if|in\s+case\s+of)\b[^,;()\n]*)
    | (?P<num>\b(?P<n>\d+)\s*(?P<unit>months?|years?|yrs?)\b)
    | (?P<code>\bForm\s+(?:16|26AS)\b|\bGSTR[-\s]?3B\b|\b3CB\b|\b3CD\b|\bUIDN\b)
    """,
    re.X | re.I,
)


def tokenize(text: str):
    """Split document text into (kind, text) tokens. Kinds: text, b (bold), num, if, req."""
    toks = []
    pos = 0
    for m in CHIP_RE.finditer(text):
        if m.start() > pos:
            toks.append(("text", text[pos : m.start()]))
        if m.group("req") is not None:
            toks.append(("req", m.group("reqtxt").strip() + " required"))
        elif m.group("ifp") is not None:
            toks.append(("if", m.group("ifp").strip()))
        elif m.group("ifn") is not None:
            toks.append(("if", m.group("ifn").strip().rstrip(".")))
        elif m.group("num") is not None:
            toks.append(("num", f'{m.group("n")} {m.group("unit").lower()}'))
        else:
            toks.append(("b", m.group("code")))
        pos = m.end()
    if pos < len(text):
        toks.append(("text", text[pos:]))
    return toks


def classify_detail(s: str):
    s = s.strip()
    if s.lower().startswith("tag:"):
        return "tag", s[4:].strip()
    low = s.lower()
    if low.startswith(("if ", "in case")):
        return "if", s
    if "require" in low:
        return "req", s
    if re.search(r"\d|month|year", low):
        return "num", s
    return "tag", s


def esc_rupee(t: str) -> str:
    return t.replace("₹", "Rs.")


def spaced_width(text, font, size, space):
    return stringWidth(text, font, size) + space * (len(text) - 1)


def chip_label(kind, text):
    return text.upper() if CHIP[kind]["upper"] else text


def chip_size(kind, size):
    return size * CHIP[kind]["scale"]


def chip_width(kind, text, size):
    cs = chip_size(kind, size)
    return stringWidth(chip_label(kind, text), CHIP_FONT, cs) + 2 * (0.5 * cs + 1.4)


def draw_chip(c, x, base_y, kind, text, size):
    """A single-line tag whose neighbouring text has baseline `base_y` and size `size` (inline use)."""
    st = CHIP[kind]
    cs = chip_size(kind, size)
    label = chip_label(kind, text)
    w = chip_width(kind, text, size)
    h = cs + 3.6
    centre = base_y + 0.34 * size
    c.saveState()
    c.setLineWidth(0.55)
    c.setStrokeColor(colors.HexColor(st["stroke"]))
    if st["fill"]:
        c.setFillColor(colors.HexColor(st["fill"]))
    c.roundRect(x, centre - h / 2, w, h, 1.6, fill=1 if st["fill"] else 0, stroke=1)
    c.setFillColor(colors.HexColor(st["color"]))
    c.setFont(CHIP_FONT, cs)
    c.drawString(x + 0.5 * cs + 1.4, centre - 0.34 * cs, label)
    c.restoreState()
    return w


def wrap_label(label, font, size, max_w):
    words, lines, cur = label.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if stringWidth(trial, font, size) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def tag_block(kind, text, size, max_w):
    """A (possibly multi-line) tag for the Details column -> dict with geometry."""
    cs = chip_size(kind, size)
    padx, pady = 0.5 * cs + 1.4, 1.5
    lines = wrap_label(chip_label(kind, text), CHIP_FONT, cs, max_w - 2 * padx)
    lead = cs * 1.22
    w = max(stringWidth(l, CHIP_FONT, cs) for l in lines) + 2 * padx
    h = len(lines) * lead + 2 * pady
    return dict(kind=kind, lines=lines, cs=cs, lead=lead, padx=padx, pady=pady, w=w, h=h)


def draw_tag_block(c, x, y_top, b):
    st = CHIP[b["kind"]]
    c.saveState()
    c.setLineWidth(0.55)
    c.setStrokeColor(colors.HexColor(st["stroke"]))
    if st["fill"]:
        c.setFillColor(colors.HexColor(st["fill"]))
    c.roundRect(x, y_top - b["h"], b["w"], b["h"], 1.6, fill=1 if st["fill"] else 0, stroke=1)
    c.setFillColor(colors.HexColor(st["color"]))
    c.setFont(CHIP_FONT, b["cs"])
    ty = y_top - b["pady"] - b["lead"] * 0.78
    for line in b["lines"]:
        c.drawString(x + b["padx"], ty, line)
        ty -= b["lead"]
    c.restoreState()


# ── flowables ─────────────────────────────────────────────────────────────
class TableRow(Flowable):
    """One checklist row: small checkbox | document text | details tags, with a hairline beneath."""

    SIZE = 8.4
    LEAD = 12.6
    VPAD = 2.0
    CELL_W = 5.0 * mm
    TAG_GAP = 1.6

    NUM_W = 6.4 * mm

    def __init__(self, raw: str, details_w: float = 0.0, num: str | None = None):
        super().__init__()
        self.num = num
        self.mode = "check"
        text = raw
        if raw.startswith("!"):
            self.mode, text = "strong", raw[1:].strip()
        elif raw.startswith("*"):
            self.mode, text = "note", raw[1:].strip()
        elif raw.startswith("-"):
            self.mode, text = "bullet", raw[1:].strip()
        doc, _, det = esc_rupee(text).partition(" || ")
        self.tokens = tokenize(doc.strip())
        self.details = [classify_detail(d) for d in det.split(" | ") if d.strip()]
        self.details_w = details_w

    def has_details(self):
        return bool(self.details)

    def wrap(self, aw, ah):
        size = self.SIZE
        font = "Helvetica-Oblique" if self.mode == "note" else "Helvetica"
        bold = "Helvetica-Bold" if self.mode == "strong" else font
        self.left = (self.NUM_W if self.num else 0.0)
        doc_w = aw - self.left - self.CELL_W - (self.details_w + 2.4 * mm if self.details_w else 0)
        lines = [[]]
        x = 0.0
        for kind, s in self.tokens:
            if kind in ("text", "b"):
                f = "Helvetica-Bold" if kind == "b" else bold
                for m in re.finditer(r"\S+|\s+", s):
                    piece = m.group(0)
                    if piece.isspace():
                        if x == 0:
                            continue
                        w = stringWidth(" ", f, size)
                        lines[-1].append(("sp", " ", w, f))
                        x += w
                        continue
                    w = stringWidth(piece, f, size)
                    glue = bool(lines[-1]) and lines[-1][-1][0] == "gap" and piece[0] in ",.;:"
                    if x + w > doc_w and x > 0 and not glue:  # punctuation stays attached to a tag before it
                        if lines[-1] and lines[-1][-1][0] == "sp":
                            lines[-1].pop()
                        lines.append([])
                        x = 0.0
                    lines[-1].append(("w", piece, w, f))
                    x += w
            else:
                cw = chip_width(kind, s, size)
                if x + cw > doc_w and x > 0:
                    if lines[-1] and lines[-1][-1][0] == "sp":
                        lines[-1].pop()
                    lines.append([])
                    x = 0.0
                lines[-1].append(("chip", s, cw, kind))
                x += cw + 1.6
                lines[-1].append(("gap", "", 1.6, None))
        self.lines = lines
        self.doc_h = len(lines) * self.LEAD
        # details column: stacked tags
        self.blocks = []
        det_h = 0.0
        if self.details_w:
            for kind, s in self.details:
                b = tag_block(kind, s, size, self.details_w)
                self.blocks.append(b)
                det_h += b["h"] + self.TAG_GAP
            det_h = max(det_h - self.TAG_GAP, 0.0)
        self.det_h = det_h
        self.width = aw
        self.height = max(self.doc_h, det_h + (self.LEAD - 9) * 0.0) + 2 * self.VPAD
        return aw, self.height

    def draw(self):
        c = self.canv
        size = self.SIZE
        h, w = self.height, self.width
        # hairline under the row and a faint divider before the details column
        c.setStrokeColor(ROW_LINE)
        c.setLineWidth(0.6)
        c.line(0, 0, w, 0)
        det_x = w - self.details_w if self.details_w else None
        if det_x is not None:
            c.line(det_x - 1.6 * mm, 0.0, det_x - 1.6 * mm, h)
        first_centre = h - self.VPAD - self.LEAD / 2
        if self.mode in ("check", "strong"):
            sz = 2.6 * mm
            c.setStrokeColor(BOX_LINE)
            c.setFillColor(colors.white)
            c.setLineWidth(0.7)
            c.rect(self.left + 0.2, first_centre - sz / 2, sz, sz, fill=1, stroke=1)
        elif self.mode == "bullet" and not self.num:
            c.setFillColor(GOLD)
            c.circle(1.4 * mm, first_centre, 0.9, fill=1, stroke=0)
        if self.num:
            c.setFillColor(NUM_COLOR)
            c.setFont("Helvetica-Bold", max(self.SIZE - 1.2, 6.2))
            c.drawString(0, first_centre - 0.34 * self.SIZE, self.num)
        for i, line in enumerate(self.lines):
            centre = h - self.VPAD - i * self.LEAD - self.LEAD / 2
            base = centre - 0.34 * size
            x = self.left + self.CELL_W
            for part in line:
                tag = part[0]
                if tag in ("w", "sp"):
                    c.setFont(part[3], size)
                    c.setFillColor(MUTED if self.mode == "note" else (NAVY_DEEP if part[3] == "Helvetica-Bold" else INK))
                    c.drawString(x, base, part[1])
                    x += part[2]
                elif tag == "gap":
                    x += part[2]
                else:
                    draw_chip(c, x, base, part[3], part[1], size)
                    x += part[2]
        if self.blocks:
            y_top = h - self.VPAD - (self.LEAD - self.blocks[0]["h"]) / 2 if self.blocks[0]["h"] < self.LEAD else h - self.VPAD
            for b in self.blocks:
                draw_tag_block(c, det_x, y_top, b)
                y_top -= b["h"] + self.TAG_GAP


class SectionBar(Flowable):
    """Small spaced heading, the section note beside it, a 'DETAILS' column label, and a thin rule."""

    def __init__(self, title: str, note=None, details_w: float = 0.0, num: str | None = None):
        super().__init__()
        self.title, self.note, self.details_w, self.num = title, note, details_w, num

    def wrap(self, aw, ah):
        self.width = aw
        self.label = esc_rupee(self.title).upper()
        self.indent = 6.4 * mm if self.num else 0.0
        avail = aw - self.indent - (self.details_w + 2 * mm if self.details_w else 0)
        self.tsize = 8.0
        while spaced_width(self.label, "Helvetica-Bold", self.tsize, 0.7) > avail and self.tsize > 6.6:
            self.tsize -= 0.2
        # if the title still crowds the DETAILS label, leave the label off rather than overlap it
        self.show_details = bool(self.details_w) and spaced_width(self.label, "Helvetica-Bold", self.tsize, 0.7) <= avail
        if not self.show_details and self.details_w:
            while spaced_width(self.label, "Helvetica-Bold", self.tsize, 0.7) > aw - self.indent and self.tsize > 6.0:
                self.tsize -= 0.2
        self.height = 6.6 * mm
        return aw, self.height

    def draw(self):
        c = self.canv
        base = self.height - 3.8 * mm
        if self.num:
            c.setFillColor(NUM_COLOR)
            c.setFont("Helvetica-Bold", self.tsize + 1.6)
            c.drawString(0, base - 0.3, self.num)
        t = c.beginText(self.indent, base)
        t.setFont("Helvetica-Bold", self.tsize)
        t.setFillColor(NAVY)
        t.setCharSpace(0.7)
        t.textOut(self.label)
        t.setCharSpace(0)  # otherwise the spacing leaks onto later text
        c.drawText(t)
        used = spaced_width(self.label, "Helvetica-Bold", self.tsize, 0.7)
        if self.note:
            room = self.width - self.indent - (self.details_w + 2 * mm if (self.details_w and self.show_details) else 0) - used - 4 * mm
            note = esc_rupee(self.note)
            size = 7.0
            while stringWidth(note, "Helvetica", size) > room and size > 5.8:
                size -= 0.2
            if stringWidth(note, "Helvetica", size) <= room:
                c.setFillColor(FAINT)
                c.setFont("Helvetica", size)
                c.drawString(self.indent + used + 4 * mm, base, note)
        if self.details_w and self.show_details:
            c.setFillColor(FAINT)
            c.setFont("Helvetica-Bold", 6.4)
            t2 = c.beginText(self.width - self.details_w, base)
            t2.setFont("Helvetica-Bold", 6.4)
            t2.setFillColor(FAINT)
            t2.setCharSpace(0.7)
            t2.textOut("DETAILS")
            t2.setCharSpace(0)
            c.drawText(t2)
        c.setStrokeColor(HAIR)
        c.setLineWidth(0.7)
        c.line(0, 0.9 * mm, self.width, 0.9 * mm)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.2)
        c.line(0, 0.9 * mm, 11 * mm, 0.9 * mm)


class SectionTable(Flowable):
    """Heading + rows as one block. If it must split, the next part repeats the heading."""

    def __init__(self, title, note, items, details_w, cont=False, num=None):
        super().__init__()
        self.title, self.note, self.items, self.cont = title, note, items, cont
        self.details_w, self.num = details_w, num
        self.bar = SectionBar(title + ("  (continued)" if cont else ""), None if cont else note, details_w, num)

    def wrap(self, aw, ah):
        self.width = aw
        _, bh = self.bar.wrap(aw, ah)
        self.heights = [it.wrap(aw, ah)[1] for it in self.items]
        self.bar_h = bh
        self.height = bh + sum(self.heights)
        return aw, self.height

    def split(self, aw, ah):
        self.wrap(aw, ah)
        used = self.bar_h
        k = 0
        for h in self.heights:
            if used + h > ah:
                break
            used += h
            k += 1
        if k < 2 or k >= len(self.items):
            return []
        if len(self.items) - k == 1 and k > 2:  # don't strand a single row on its own
            k -= 1
        return [
            SectionTable(self.title, self.note, self.items[:k], self.details_w, self.cont, self.num),
            SectionTable(self.title, self.note, self.items[k:], self.details_w, cont=True, num=self.num),
        ]

    def draw(self):
        c = self.canv
        y = self.height - self.bar_h
        self.bar.drawOn(c, 0, y)
        for it, h in zip(self.items, self.heights):
            y -= h
            it.drawOn(c, 0, y)


class SubHead(Flowable):
    def __init__(self, text: str):
        super().__init__()
        self.text = text

    def wrap(self, aw, ah):
        self.width = aw
        self.height = 6.0 * mm
        return aw, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(0, 1.8 * mm, esc_rupee(self.text))


class FormGroup(Flowable):
    """A block of fill-in lines (small label above a thin underline) on a 2- or 3-column grid."""

    def __init__(self, title: str, fields, cols: int = 2, box_h=7.4 * mm, label_h=3.6 * mm, row_gap=2.6 * mm,
                 title_h=8.6 * mm):
        super().__init__()
        self.title, self.fields, self.cols = title, fields, cols
        self.box_h, self.label_h, self.row_gap, self.title_h = box_h, label_h, row_gap, title_h

    def _rows(self):
        rows, cur, used = [], [], 0.0
        for label, span in self.fields:
            if used + span > self.cols + 1e-6:
                rows.append(cur)
                cur, used = [], 0.0
            cur.append((label, span))
            used += span
            if used >= self.cols - 1e-6:
                rows.append(cur)
                cur, used = [], 0.0
        if cur:
            rows.append(cur)
        return rows

    def wrap(self, aw, ah):
        self.width = aw
        self.rows = self._rows()
        self.height = self.title_h + len(self.rows) * (self.label_h + self.box_h + self.row_gap)
        return aw, self.height

    def draw(self):
        c = self.canv
        gap = 5 * mm
        unit = (self.width - gap * (self.cols - 1)) / self.cols
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(0, self.height - self.title_h + 2.6 * mm, esc_rupee(self.title))
        y = self.height - self.title_h
        for row in self.rows:
            x = 0.0
            for label, span in row:
                w = unit * span + gap * (span - 1)
                c.setFillColor(FAINT)
                c.setFont("Helvetica-Bold", 6.2)
                c.drawString(x, y - self.label_h + 0.9 * mm, esc_rupee(label).upper())
                c.setStrokeColor(FIELD_LINE)
                c.setLineWidth(0.8)
                c.line(x, y - self.label_h - self.box_h + 0.8 * mm, x + w, y - self.label_h - self.box_h + 0.8 * mm)
                x += w + gap
            y -= self.label_h + self.box_h + self.row_gap


def callout(text: str, width: float):
    """A quiet note: a hairline above, small grey text."""
    style = ParagraphStyle("Callout", fontName="Helvetica", fontSize=7.8, leading=11.2, textColor=MUTED)
    t = Table([[Paragraph(text, style)]], colWidths=[width])
    t.setStyle(
        TableStyle(
            [
                ("LINEABOVE", (0, 0), (-1, 0), 0.7, HAIR),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return t


# ── page furniture ────────────────────────────────────────────────────────
def draw_spine(c):
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, 0, SPINE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(SPINE_W, 0, 0.45 * mm, PAGE_H, fill=1, stroke=0)
    c.restoreState()


_LOGO_CACHE = []


def _logo():
    """The brand lockup, downscaled once so each PDF stays small."""
    if not _LOGO_CACHE:
        from PIL import Image
        from reportlab.lib.utils import ImageReader

        img = Image.open(LOGO_PATH).convert("RGBA")
        w = 400
        img = img.resize((w, round(w * LOGO_RATIO)), Image.LANCZOS)
        _LOGO_CACHE.append(ImageReader(img))
    return _LOGO_CACHE[0]


def draw_first_header(c, meta):
    draw_spine(c)
    cx = CONTENT_X + CONTENT_W / 2
    logo_h = 13 * mm
    logo_w = logo_h / LOGO_RATIO
    c.drawImage(_logo(), cx - logo_w / 2, PAGE_H - 9 * mm - logo_h, logo_w, logo_h, mask="auto")

    tag = "YOUR GROWTH, OUR FINANCIAL EXPERTISE"
    t = c.beginText(cx - spaced_width(tag, "Helvetica-Bold", 6.8, 2.4) / 2, PAGE_H - 9 * mm - logo_h - 4 * mm)
    t.setFont("Helvetica-Bold", 6.8)
    t.setFillColor(GOLD)
    t.setCharSpace(2.4)
    t.textOut(tag)
    t.setCharSpace(0)
    c.drawText(t)

    y = PAGE_H - 9 * mm - logo_h - 9 * mm
    c.setStrokeColor(HAIR)
    c.setLineWidth(0.7)
    c.line(CONTENT_X, y, CONTENT_X + CONTENT_W, y)

    title = esc_rupee(meta["title"])
    size = 17.0
    max_title_w = CONTENT_W - 46 * mm
    while stringWidth(title, "Times-Bold", size) > max_title_w and size > 11:
        size -= 0.5
    c.setFillColor(NAVY_DEEP)
    c.setFont("Times-Bold", size)
    c.drawString(CONTENT_X, y - 9 * mm, title)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.2)
    c.drawString(CONTENT_X, y - 14 * mm, meta["subtitle"])

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawRightString(CONTENT_X + CONTENT_W, y - 7.4 * mm, PHONE)
    c.setFont("Helvetica", 8.2)
    c.drawRightString(CONTENT_X + CONTENT_W, y - 11.6 * mm, EMAIL)


def draw_later_header(c, meta):
    draw_spine(c)
    top = PAGE_H - 11 * mm
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawString(CONTENT_X, top, "GROWTH CAPITAL SERVICES")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.2)
    c.drawRightString(CONTENT_X + CONTENT_W, top, esc_rupee(meta["title"]) + "  ·  continued")
    c.setStrokeColor(HAIR)
    c.setLineWidth(0.7)
    c.line(CONTENT_X, top - 2.4 * mm, CONTENT_X + CONTENT_W, top - 2.4 * mm)


class NumberedCanvas(rl_canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved = []

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            self._footer(total)
            super().showPage()
        super().save()

    def _footer(self, total):
        y = 9.5 * mm
        self.setStrokeColor(HAIR)
        self.setLineWidth(0.6)
        self.line(CONTENT_X, y + 3.6 * mm, CONTENT_X + CONTENT_W, y + 3.6 * mm)
        self.setFillColor(FAINT)
        self.setFont("Helvetica", 6.8)
        self.drawString(CONTENT_X, y, FOOTER_NOTE)
        self.drawRightString(CONTENT_X + CONTENT_W, y, f"{self._pageNumber} / {total}")


# ── document builder ──────────────────────────────────────────────────────
def build_pdf(path, title, sections, subtitle=None, columns=1, size=None):
    """sections: list of dicts —
         {"title", "note"?, "items": [...]}                  checklist table
         {"title", "note"?, "form": [(group_title, [(label, span)...])], "cols"?}   fill-in lines
         {"callout": "<b>html</b> text"}                      standalone quiet note
    """
    subtitle = subtitle or "Document checklist"
    story = []
    two = columns == 2
    GAP = 8 * mm
    col_w = (CONTENT_W - GAP) / 2 if two else CONTENT_W
    details_w = 30 * mm if two else 52 * mm
    base = size or (8.0 if two else 8.6)
    TableRow.SIZE, TableRow.LEAD, TableRow.VPAD = base, base * 1.45, 1.3

    def rows_for(items, sec_no):
        has = any(" || " in it for it in items if not it.startswith("## "))
        dw = details_w if has else 0.0
        out = []
        k = 0
        for raw in items:
            if raw.startswith("## "):
                out.append(CondPageBreak(24 * mm))
                out.append(SubHead(raw[3:].strip()))
            else:
                k += 1
                out.append(TableRow(raw, dw, f"{sec_no}.{k}"))
        return out, dw

    sec_no = 0
    for sec in sections:
        if "callout" in sec:
            story.append(callout(sec["callout"], col_w))
            story.append(Spacer(1, 3 * mm))
            continue
        if "form" in sec:
            if two:  # fill-in forms get a fresh full-width page
                story.append(NextPageTemplate("single"))
                story.append(PageBreak())
            story.append(CondPageBreak(34 * mm))
            sec_no += 1
            story.append(SectionBar(sec["title"], sec.get("note"), num=str(sec_no)))
            story.append(Spacer(1, 2 * mm))
            compact = sec.get("cols", 2) == 3
            for gtitle, fields in sec["form"]:
                story.append(CondPageBreak(30 * mm if compact else 60 * mm))
                if compact:
                    story.append(FormGroup(gtitle, fields, cols=3, box_h=5.0 * mm, label_h=2.8 * mm,
                                           row_gap=1.2 * mm, title_h=5.8 * mm))
                else:
                    story.append(FormGroup(gtitle, fields))
        else:
            sec_no += 1
            flows, dw = rows_for(sec["items"], sec_no)
            table = SectionTable(sec["title"], sec.get("note"), flows, dw, num=str(sec_no))
            if len(flows) <= (7 if two else 9):  # short section: keep it whole
                story.append(KeepTogether([table]))
            else:
                story.append(CondPageBreak(34 * mm))
                story.append(table)
        story.append(Spacer(1, 4.2 * mm if two else 5.0 * mm))

    meta = {"title": title, "subtitle": subtitle}
    first_top = 53 * mm
    doc = BaseDocTemplate(
        path,
        pagesize=A4,
        title=f"{title} — Document Checklist",
        author="Growth Capital Services",
        subject="Document checklist",
    )
    bottom = 16 * mm
    top_later = 22 * mm

    def frames(top, ident):
        if two:
            h = PAGE_H - top - bottom
            return [
                Frame(CONTENT_X, bottom, col_w, h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id=f"{ident}L"),
                Frame(CONTENT_X + col_w + GAP, bottom, col_w, h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id=f"{ident}R"),
            ]
        return [Frame(CONTENT_X, bottom, CONTENT_W, PAGE_H - top - bottom, leftPadding=0, rightPadding=0,
                      topPadding=0, bottomPadding=0, id=ident)]

    templates = [
        PageTemplate(id="first", frames=frames(first_top, "f"), onPage=lambda c, d: draw_first_header(c, meta),
                     autoNextPageTemplate="later"),
        PageTemplate(id="later", frames=frames(top_later, "l"), onPage=lambda c, d: draw_later_header(c, meta)),
    ]
    if two:
        single = [Frame(CONTENT_X, bottom, CONTENT_W, PAGE_H - 19 * mm - bottom, leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0, id="s")]
        templates.append(PageTemplate(id="single", frames=single, onPage=lambda c, d: draw_later_header(c, meta)))
    doc.addPageTemplates(templates)
    doc.build(story, canvasmaker=NumberedCanvas)
    return meta

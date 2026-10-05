"""Renderer for the branded document-checklist PDFs.

Items are plain strings. Important details inside them are detected and drawn as
boxed chips so they stand out:

  * numbers / periods        "Latest 4 months salary slips"      -> gold box "4 months"
  * conditions               "(if income is taxable)", "if any"  -> navy-outline box "IF ..."
  * must-have proofs         "(require 3 year continuity proof)" -> solid navy box
  * form / statement codes   "Form 16", "GSTR 3B", "3CB"         -> grey box
  * "[[Tag]] text"           an explicit navy-gold tag at the start of an item

Item prefixes:  "!" bold item, "*" italic note (no checkbox), "-" bullet, "## " sub-heading.
"""

import os
import re
import textwrap

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
    KeepTogether,
    Frame,
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
GOLD = colors.HexColor("#C8952A")
GOLD_LIGHT = colors.HexColor("#E4B028")
INK = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#6B7280")
HAIRLINE = colors.HexColor("#E7E4DC")
PALE_GOLD = colors.HexColor("#FAF5E8")
FIELD_LINE = colors.HexColor("#C9CDD6")

PAGE_W, PAGE_H = A4
SPINE_W = 3.2 * mm
MARGIN_L = 16 * mm
MARGIN_R = 14 * mm
CONTENT_X = SPINE_W + MARGIN_L - 3 * mm  # a little tighter than before: more room for long items
CONTENT_W = PAGE_W - CONTENT_X - MARGIN_R

LOGO_PATH = r"D:\CRM WEBSITE - GCS\secure-sums-site\public\brand\gcs-lockup.png"
LOGO_RATIO = 545 / 870  # height / width

PHONE = "+91 88280 01700"
EMAIL = "growthcs17@gmail.com"

# ── chips ─────────────────────────────────────────────────────────────────
CHIP = {
    "num": dict(fill="#FCE8A8", stroke="#C8952A", color="#071230", scale=1.0, upper=False),
    "if": dict(fill="#E8ECF8", stroke="#0B1849", color="#0B1849", scale=0.8, upper=True),
    "req": dict(fill="#0B1849", stroke="#0B1849", color="#F4D77B", scale=0.8, upper=True),
    "code": dict(fill="#F1F3F8", stroke="#B9C0D6", color="#0B1849", scale=1.0, upper=False),
    "tag": dict(fill="#C8952A", stroke="#C8952A", color="#071230", scale=0.82, upper=True),
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
    """Split an item string into (kind, text) tokens."""
    toks = []
    m = re.match(r"^\[\[(.+?)\]\]\s*(.*)$", text)
    if m:
        toks.append(("tag", m.group(1)))
        text = m.group(2)
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
            toks.append(("code", m.group("code")))
        pos = m.end()
    if pos < len(text):
        toks.append(("text", text[pos:]))
    return toks


def esc_rupee(t: str) -> str:
    return t.replace("₹", "Rs.")


# ── low-level chip drawing (shared by items and the legend) ──────────────
def chip_label(kind: str, text: str) -> str:
    return text.upper() if CHIP[kind]["upper"] else text


def chip_size(kind: str, size: float) -> float:
    return size * CHIP[kind]["scale"]


def chip_width(kind: str, text: str, size: float) -> float:
    cs = chip_size(kind, size)
    return stringWidth(chip_label(kind, text), CHIP_FONT, cs) + 2 * (0.42 * cs + 1.6)


def draw_chip(c, x, base_y, kind, text, size):
    """Draw a chip whose neighbouring text has baseline `base_y` and size `size`."""
    st = CHIP[kind]
    cs = chip_size(kind, size)
    label = chip_label(kind, text)
    w = chip_width(kind, text, size)
    h = cs + 4.2
    centre = base_y + 0.34 * size
    c.saveState()
    c.setFillColor(colors.HexColor(st["fill"]))
    c.setStrokeColor(colors.HexColor(st["stroke"]))
    c.setLineWidth(0.7)
    c.roundRect(x, centre - h / 2, w, h, 1.7, fill=1, stroke=1)
    c.setFillColor(colors.HexColor(st["color"]))
    c.setFont(CHIP_FONT, cs)
    c.drawString(x + 0.42 * cs + 1.6, centre - 0.34 * cs, label)
    c.restoreState()
    return w


# ── flowables ─────────────────────────────────────────────────────────────
class RichItem(Flowable):
    """One checklist line: checkbox + text with inline chips, wrapped to width."""

    SIZE = 8.8
    LEAD = 14.0
    VPAD = 1.5

    def __init__(self, raw: str):
        super().__init__()
        self.mode = "check"
        text = raw
        if raw.startswith("!"):
            self.mode, text = "strong", raw[1:].strip()
        elif raw.startswith("*"):
            self.mode, text = "note", raw[1:].strip()
        elif raw.startswith("-"):
            self.mode, text = "bullet", raw[1:].strip()
        self.text = esc_rupee(text)
        self.tokens = tokenize(self.text)
        self.lines = []
        self.indent = 6.4 * mm

    def kinds(self):
        return {k for k, _ in self.tokens if k != "text"}

    def wrap(self, aw, ah):
        size = self.SIZE
        font = "Helvetica-Oblique" if self.mode == "note" else "Helvetica"
        bold = "Helvetica-Bold" if self.mode == "strong" else font
        max_w = aw - self.indent
        lines = [[]]
        x = 0.0
        for kind, s in self.tokens:
            if kind == "text":
                for m in re.finditer(r"\S+|\s+", s):
                    piece = m.group(0)
                    if piece.isspace():
                        if x == 0:
                            continue
                        w = stringWidth(" ", bold, size)
                        lines[-1].append(("sp", " ", w))
                        x += w
                        continue
                    w = stringWidth(piece, bold, size)
                    if x + w > max_w and x > 0:
                        if lines[-1] and lines[-1][-1][0] == "sp":
                            lines[-1].pop()
                        lines.append([])
                        x = 0.0
                    lines[-1].append(("w", piece, w))
                    x += w
            else:
                cw = chip_width(kind, s, size)
                if x + cw > max_w and x > 0:
                    if lines[-1] and lines[-1][-1][0] == "sp":
                        lines[-1].pop()
                    lines.append([])
                    x = 0.0
                gap = 4.2 if kind == "tag" else 1.4
                lines[-1].append(("chip", s, cw, kind))
                x += cw + gap
                lines[-1].append(("gap", "", gap))
        self.lines = lines
        self.font, self.bold = font, bold
        self.width = aw
        self.height = len(lines) * self.LEAD + 2 * self.VPAD
        return aw, self.height

    def draw(self):
        c = self.canv
        size = self.SIZE
        first_centre = self.height - self.VPAD - self.LEAD / 2
        # marker
        if self.mode in ("check", "strong"):
            s = 2.9 * mm
            c.setStrokeColor(NAVY)
            c.setFillColor(colors.white)
            c.setLineWidth(0.8)
            c.rect(0.4, first_centre - s / 2, s, s, fill=1, stroke=1)
        elif self.mode == "bullet":
            c.setFillColor(GOLD)
            c.rect(0.9, first_centre - 1.1, 2.2, 2.2, fill=1, stroke=0)
        for i, line in enumerate(self.lines):
            centre = self.height - self.VPAD - i * self.LEAD - self.LEAD / 2
            base = centre - 0.34 * size
            x = self.indent if self.mode != "note" else self.indent
            for part in line:
                tag = part[0]
                if tag in ("w", "sp"):
                    c.setFont(self.bold, size)
                    c.setFillColor(MUTED if self.mode == "note" else INK)
                    c.drawString(x, base, part[1])
                    x += part[2]
                elif tag == "gap":
                    x += part[2]
                else:
                    draw_chip(c, x, base, part[3], part[1], size)
                    x += part[2]


class SectionBar(Flowable):
    """Pale-gold heading bar. The small note sits on the right, or on a second line if it won't fit."""

    def __init__(self, title: str, note: str | None = None):
        super().__init__()
        self.title, self.note = title, note

    def wrap(self, aw, ah):
        self.width = aw
        self.stacked = False
        # shrink a long title until it fits the bar
        self.tsize = 8.9
        label = esc_rupee(self.title).upper()
        while stringWidth(label, "Helvetica-Bold", self.tsize) > aw - 9 * mm and self.tsize > 6.8:
            self.tsize -= 0.2
        if self.note:
            tw = stringWidth(label, "Helvetica-Bold", self.tsize)
            nw = stringWidth(esc_rupee(self.note), "Helvetica-Oblique", 7.4)
            self.stacked = 6.6 * mm + tw + nw + 6 * mm > aw
        self.height = 10.6 * mm if self.stacked else 7.2 * mm
        return aw, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(PALE_GOLD)
        c.rect(0, 0, self.width, self.height, fill=1, stroke=0)
        title_y = self.height - 4.6 * mm if self.stacked else self.height / 2 - 3.0
        c.setFillColor(GOLD)
        c.rect(2.2 * mm, title_y + 1.6, 2.8, 2.8, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", self.tsize)
        c.drawString(6.6 * mm, title_y, esc_rupee(self.title).upper())
        if self.note:
            c.setFillColor(MUTED)
            c.setFont("Helvetica-Oblique", 7.4)
            if self.stacked:
                c.drawString(6.6 * mm, 1.9 * mm, esc_rupee(self.note))
            else:
                c.drawRightString(self.width - 2.5 * mm, title_y + 0.4, esc_rupee(self.note))


class SubHead(Flowable):
    def __init__(self, text: str):
        super().__init__()
        self.text = text

    def wrap(self, aw, ah):
        self.width = aw
        self.height = 6.4 * mm
        return aw, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(GOLD)
        c.rect(0.4, 1.2 * mm, 1.1, 3.6 * mm, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.4)
        c.drawString(3.4 * mm, 1.9 * mm, esc_rupee(self.text))


class FormGroup(Flowable):
    """A block of fill-in boxes (label above an empty rounded box) on a 2- or 3-column grid."""

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
        gap = 4 * mm
        unit = (self.width - gap * (self.cols - 1)) / self.cols
        c.setFillColor(GOLD)
        c.rect(0.4, self.height - self.title_h + 2.2 * mm, 1.1, 3.6 * mm, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.6)
        c.drawString(3.4 * mm, self.height - self.title_h + 3.2 * mm, esc_rupee(self.title))
        y = self.height - self.title_h
        for row in self.rows:
            x = 0.0
            for label, span in row:
                w = unit * span + gap * (span - 1)
                c.setFillColor(MUTED)
                c.setFont("Helvetica-Bold", 6.4)
                c.drawString(x + 0.6, y - self.label_h + 0.9 * mm, esc_rupee(label).upper())
                c.setStrokeColor(FIELD_LINE)
                c.setFillColor(colors.white)
                c.setLineWidth(0.8)
                c.roundRect(x, y - self.label_h - self.box_h, w, self.box_h, 1.6, fill=1, stroke=1)
                x += w + gap
            y -= self.label_h + self.box_h + self.row_gap


def callout(text: str, width: float):
    """Pale-gold note box with a gold bar down the left edge."""
    style = ParagraphStyle(
        "Callout", fontName="Helvetica", fontSize=8.2, leading=11.6, textColor=INK
    )
    p = Paragraph(text, style)
    t = Table([[p]], colWidths=[width])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE_GOLD),
                ("LINEBEFORE", (0, 0), (0, -1), 2.2, GOLD),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
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
    c.rect(SPINE_W, 0, 0.6 * mm, PAGE_H, fill=1, stroke=0)
    c.restoreState()


_LOGO_CACHE = []


def _logo():
    """The brand lockup, downscaled once (about 40 px per mm is plenty) so each PDF stays small."""
    if not _LOGO_CACHE:
        from PIL import Image
        from reportlab.lib.utils import ImageReader

        img = Image.open(LOGO_PATH).convert("RGBA")
        w = 400
        img = img.resize((w, round(w * LOGO_RATIO)), Image.LANCZOS)
        _LOGO_CACHE.append(ImageReader(img))
    return _LOGO_CACHE[0]


def spaced_width(text, font, size, space):
    return stringWidth(text, font, size) + space * (len(text) - 1)


def draw_first_header(c, meta):
    draw_spine(c)
    cx = CONTENT_X + CONTENT_W / 2
    logo_h = 14 * mm
    logo_w = logo_h / LOGO_RATIO
    c.drawImage(_logo(), cx - logo_w / 2, PAGE_H - 9 * mm - logo_h, logo_w, logo_h, mask="auto")

    tag = "YOUR GROWTH, OUR FINANCIAL EXPERTISE"
    t = c.beginText(cx - spaced_width(tag, "Helvetica-Bold", 7.4, 2.4) / 2, PAGE_H - 9 * mm - logo_h - 4.2 * mm)
    t.setFont("Helvetica-Bold", 7.4)
    t.setFillColor(GOLD)
    t.setCharSpace(2.4)
    t.textOut(tag)
    t.setCharSpace(0)  # otherwise the spacing leaks onto every later line on the page
    c.drawText(t)

    y = PAGE_H - 9 * mm - logo_h - 8.4 * mm
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.8)
    c.line(CONTENT_X, y, CONTENT_X + CONTENT_W, y)

    title = esc_rupee(meta["title"])
    size = 17.0
    max_title_w = CONTENT_W - 44 * mm
    while stringWidth(title, "Times-Bold", size) > max_title_w and size > 11:
        size -= 0.5
    c.setFillColor(NAVY_DEEP)
    c.setFont("Times-Bold", size)
    c.drawString(CONTENT_X, y - 8.6 * mm, title)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.4)
    c.drawString(CONTENT_X, y - 13.4 * mm, meta["subtitle"])

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.6)
    c.drawRightString(CONTENT_X + CONTENT_W, y - 6.8 * mm, PHONE)
    c.drawRightString(CONTENT_X + CONTENT_W, y - 11.0 * mm, EMAIL)

    # legend for the highlight boxes used in this document
    legend = [
        ("num", "4 months", "a number or period to match"),
        ("if", "if applicable", "only if it applies to you"),
        ("req", "must-have", "a required proof"),
    ]
    legend = [row for row in legend if row[0] in meta["kinds"]]
    if legend:
        ly = y - 20.2 * mm
        x = CONTENT_X
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 6.8)
        c.drawString(x, ly, "HOW TO READ")
        x += stringWidth("HOW TO READ", "Helvetica-Bold", 6.8) + 8
        for kind, sample, meaning in legend:
            x += draw_chip(c, x, ly, kind, sample, 7.6) + 3
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7.2)
            c.drawString(x, ly, meaning)
            x += stringWidth(meaning, "Helvetica", 7.2) + 12


def draw_later_header(c, meta):
    draw_spine(c)
    top = PAGE_H - 11 * mm
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 7.6)
    c.drawString(CONTENT_X, top, "GROWTH CAPITAL SERVICES")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.6)
    c.drawRightString(CONTENT_X + CONTENT_W, top, esc_rupee(meta["title"]) + "  ·  continued")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(CONTENT_X, top - 2.2 * mm, CONTENT_X + CONTENT_W, top - 2.2 * mm)


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
        self.setStrokeColor(HAIRLINE)
        self.setLineWidth(0.6)
        self.line(CONTENT_X, y + 3.6 * mm, CONTENT_X + CONTENT_W, y + 3.6 * mm)
        self.setFillColor(NAVY)
        self.setFont("Helvetica-Bold", 7.2)
        self.drawString(CONTENT_X, y, "Growth Capital Services")
        self.setFillColor(MUTED)
        self.setFont("Helvetica", 7.2)
        self.drawString(
            CONTENT_X + stringWidth("Growth Capital Services", "Helvetica-Bold", 7.2) + 5,
            y,
            f"·  {PHONE}  ·  {EMAIL}",
        )
        self.drawRightString(CONTENT_X + CONTENT_W, y, f"Page {self._pageNumber} of {total}")


# ── document builder ──────────────────────────────────────────────────────
def build_pdf(path, title, sections, subtitle=None, closing=True, columns=1):
    """sections: list of dicts —
         {"title", "note"?, "items": [...]}                  checklist block
         {"title", "note"?, "form": [(group_title, [(label, span)...])]}   fill-in boxes
         {"callout": "<b>html</b> text"}                      standalone note box
    """
    subtitle = subtitle or "Document checklist. Please arrange copies of the items that apply to you."
    story = []
    kinds = set()
    two = columns == 2
    GAP = 6 * mm
    col_w = (CONTENT_W - GAP) / 2 if two else CONTENT_W
    if two:  # tighter type so a whole list fits on one page
        RichItem.SIZE, RichItem.LEAD, RichItem.VPAD = 8.0, 12.2, 1.0
    else:
        RichItem.SIZE, RichItem.LEAD, RichItem.VPAD = 8.8, 14.0, 1.5

    def item_flowables(items):
        out = []
        for raw in items:
            if raw.startswith("## "):
                out.append(CondPageBreak(24 * mm))
                out.append(SubHead(raw[3:].strip()))
                continue
            it = RichItem(raw)
            kinds.update(it.kinds())
            out.append(it)
        return out

    has_form = two and any("form" in sec for sec in sections)
    closing_box = None
    if closing:
        closing_box = callout(
            "<b>Send clear photos or scans of the documents that apply to you on WhatsApp, sorted by "
            "category.</b> This is an indicative list — exact requirements can vary by lender and profile, "
            f"and our team will confirm before login. Questions? Call {PHONE} or write to {EMAIL}.",
            col_w,
        )

    for sec in sections:
        if has_form and "form" in sec and closing_box is not None:
            story.append(closing_box)
            closing_box = None
        if "callout" in sec:
            story.append(callout(sec["callout"], col_w))
            story.append(Spacer(1, 3 * mm))
            continue
        head = [SectionBar(sec["title"], sec.get("note")), Spacer(1, 1.2 * mm)]
        if "form" in sec:
            if two:  # fill-in forms get a fresh full-width page
                story.append(NextPageTemplate("single"))
                story.append(PageBreak())
            story.append(CondPageBreak(34 * mm))
            story.extend(head)
            compact = sec.get("cols", 2) == 3
            for gtitle, fields in sec["form"]:
                story.append(CondPageBreak(30 * mm if compact else 60 * mm))
                if compact:
                    story.append(FormGroup(gtitle, fields, cols=3, box_h=5.0 * mm, label_h=2.8 * mm,
                                           row_gap=1.2 * mm, title_h=5.8 * mm))
                else:
                    story.append(FormGroup(gtitle, fields))
        else:
            flows = item_flowables(sec["items"])
            if len(flows) <= (7 if two else 9):  # short section: never split it across a page/column
                story.append(KeepTogether(head + flows))
            else:
                story.append(CondPageBreak(34 * mm))
                story.extend(head + flows)
        story.append(Spacer(1, 2.6 * mm if two else 3.4 * mm))

    if closing_box is not None:
        story.append(CondPageBreak(30 * mm))
        story.append(Spacer(1, 1 * mm))
        story.append(closing_box)

    meta = {"title": title, "subtitle": subtitle, "kinds": kinds}
    first_top = 58 * mm if (kinds & {"num", "if", "req"}) else 52 * mm
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

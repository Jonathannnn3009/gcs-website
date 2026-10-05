"""Renderer for the branded document-checklist PDFs — a quiet, minimal look.

Items are plain strings. Important details inside them are picked out lightly:

  * numbers / periods        "Latest 4 months salary slips"      -> "4 months" in a thin gold-outlined tag
  * conditions               "(if income is taxable)", "if any"  -> "IF INCOME IS TAXABLE" in a hairline tag
  * must-have proofs         "(require 3 year continuity proof)" -> navy-outlined tag
  * form / statement codes   "Form 16", "GSTR 3B", "3CB"         -> bold
  * "[[Tag]] text"           an explicit small gold tag at the start of an item

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
GOLD = colors.HexColor("#C8952A")
GOLD_DARK = colors.HexColor("#8F6A14")
INK = colors.HexColor("#222936")
MUTED = colors.HexColor("#6B7280")
FAINT = colors.HexColor("#9AA1AE")
HAIR = colors.HexColor("#E4E1D8")
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

# ── highlight tags ────────────────────────────────────────────────────────
CHIP = {
    "num": dict(fill="#FBF5E3", stroke="#DDC27A", color="#071230", scale=1.0, upper=False),
    "if": dict(fill=None, stroke="#AEB6CB", color="#4B5675", scale=0.8, upper=True),
    "req": dict(fill=None, stroke="#0B1849", color="#0B1849", scale=0.8, upper=True),
    "tag": dict(fill=None, stroke="#C8952A", color="#8F6A14", scale=0.76, upper=True),
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
    """Split an item string into (kind, text) tokens. Kinds: text, b (bold), num, if, req, tag."""
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
            toks.append(("b", m.group("code")))
        pos = m.end()
    if pos < len(text):
        toks.append(("text", text[pos:]))
    return toks


def esc_rupee(t: str) -> str:
    return t.replace("₹", "Rs.")


# ── tag drawing ───────────────────────────────────────────────────────────
def chip_label(kind: str, text: str) -> str:
    return text.upper() if CHIP[kind]["upper"] else text


def chip_size(kind: str, size: float) -> float:
    return size * CHIP[kind]["scale"]


def chip_width(kind: str, text: str, size: float) -> float:
    cs = chip_size(kind, size)
    return stringWidth(chip_label(kind, text), CHIP_FONT, cs) + 2 * (0.5 * cs + 1.4)


def draw_chip(c, x, base_y, kind, text, size):
    """Draw a tag whose neighbouring text has baseline `base_y` and size `size`."""
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


def spaced_width(text, font, size, space):
    return stringWidth(text, font, size) + space * (len(text) - 1)


# ── flowables ─────────────────────────────────────────────────────────────
class RichItem(Flowable):
    """One checklist line: small checkbox + text with light inline tags, wrapped to width."""

    SIZE = 8.4
    LEAD = 12.8
    VPAD = 1.5
    INDENT = 5.6 * mm

    def __init__(self, raw: str, last: bool = False):
        super().__init__()
        self.last = last
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

    def kinds(self):
        return {k for k, _ in self.tokens if k in CHIP}

    def wrap(self, aw, ah):
        size = self.SIZE
        font = "Helvetica-Oblique" if self.mode == "note" else "Helvetica"
        bold = "Helvetica-Bold" if self.mode == "strong" else font
        max_w = aw - self.INDENT
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
                    if x + w > max_w and x > 0:
                        if lines[-1] and lines[-1][-1][0] == "sp":
                            lines[-1].pop()
                        lines.append([])
                        x = 0.0
                    lines[-1].append(("w", piece, w, f))
                    x += w
            else:
                cw = chip_width(kind, s, size)
                if x + cw > max_w and x > 0:
                    if lines[-1] and lines[-1][-1][0] == "sp":
                        lines[-1].pop()
                    lines.append([])
                    x = 0.0
                gap = 3.6 if kind == "tag" else 1.6
                lines[-1].append(("chip", s, cw, kind))
                x += cw + gap
                lines[-1].append(("gap", "", gap, None))
        self.lines = lines
        self.width = aw
        self.height = len(lines) * self.LEAD + 2 * self.VPAD
        return aw, self.height

    def draw(self):
        c = self.canv
        size = self.SIZE
        first_centre = self.height - self.VPAD - self.LEAD / 2
        if self.mode in ("check", "strong"):
            sz = 2.6 * mm
            c.setStrokeColor(BOX_LINE)
            c.setFillColor(colors.white)
            c.setLineWidth(0.7)
            c.rect(0.2, first_centre - sz / 2, sz, sz, fill=1, stroke=1)
        elif self.mode == "bullet":
            c.setFillColor(GOLD)
            c.circle(1.4 * mm, first_centre, 0.9, fill=1, stroke=0)
        for i, line in enumerate(self.lines):
            centre = self.height - self.VPAD - i * self.LEAD - self.LEAD / 2
            base = centre - 0.34 * size
            x = self.INDENT
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


class SectionBar(Flowable):
    """Small spaced heading with a thin rule (gold lead-in) beneath. The note sits right or underneath."""

    def __init__(self, title: str, note: str | None = None):
        super().__init__()
        self.title, self.note = title, note

    def wrap(self, aw, ah):
        self.width = aw
        self.label = esc_rupee(self.title).upper()
        self.tsize = 8.0
        sp = 0.7
        while spaced_width(self.label, "Helvetica-Bold", self.tsize, sp) > aw and self.tsize > 6.6:
            self.tsize -= 0.2
        self.stacked = False
        if self.note:
            tw = spaced_width(self.label, "Helvetica-Bold", self.tsize, sp)
            nw = stringWidth(esc_rupee(self.note), "Helvetica-Oblique", 7.2)
            self.stacked = tw + nw + 6 * mm > aw
        self.height = 9.6 * mm if self.stacked else 6.4 * mm
        return aw, self.height

    def draw(self):
        c = self.canv
        base = self.height - 3.6 * mm
        t = c.beginText(0, base)
        t.setFont("Helvetica-Bold", self.tsize)
        t.setFillColor(NAVY)
        t.setCharSpace(0.7)
        t.textOut(self.label)
        t.setCharSpace(0)  # otherwise the spacing leaks onto later text
        c.drawText(t)
        if self.note:
            c.setFillColor(FAINT)
            c.setFont("Helvetica-Oblique", 7.2)
            if self.stacked:
                c.drawString(0, base - 3.3 * mm, esc_rupee(self.note))
            else:
                c.drawRightString(self.width, base, esc_rupee(self.note))
        c.setStrokeColor(HAIR)
        c.setLineWidth(0.7)
        c.line(0, 0.9 * mm, self.width, 0.9 * mm)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.2)
        c.line(0, 0.9 * mm, 11 * mm, 0.9 * mm)


class SectionTable(Flowable):
    """Heading + rows as one block. If it must split, the next part repeats the heading."""

    def __init__(self, title, note, items, cont=False):
        super().__init__()
        self.title, self.note, self.items, self.cont = title, note, items, cont
        self.bar = SectionBar(title + ("  (continued)" if cont else ""), None if cont else note)

    def wrap(self, aw, ah):
        self.width = aw
        _, bh = self.bar.wrap(aw, ah)
        self.heights = [it.wrap(aw, ah)[1] for it in self.items]
        self.bar_h = bh
        self.height = bh + 1.2 * mm + sum(self.heights)
        return aw, self.height

    def split(self, aw, ah):
        self.wrap(aw, ah)
        used = self.bar_h + 1.2 * mm
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
            SectionTable(self.title, self.note, self.items[:k], self.cont),
            SectionTable(self.title, self.note, self.items[k:], cont=True),
        ]

    def draw(self):
        c = self.canv
        y = self.height - self.bar_h
        self.bar.drawOn(c, 0, y)
        y -= 1.2 * mm
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
        self.setFillColor(NAVY)
        self.setFont("Helvetica-Bold", 7)
        self.drawString(CONTENT_X, y, "Growth Capital Services")
        self.setFillColor(FAINT)
        self.setFont("Helvetica", 7)
        self.drawString(
            CONTENT_X + stringWidth("Growth Capital Services", "Helvetica-Bold", 7) + 5,
            y,
            f"·  {PHONE}  ·  {EMAIL}",
        )
        self.drawRightString(CONTENT_X + CONTENT_W, y, f"{self._pageNumber} / {total}")


# ── document builder ──────────────────────────────────────────────────────
def build_pdf(path, title, sections, subtitle=None, closing=True, columns=1):
    """sections: list of dicts —
         {"title", "note"?, "items": [...]}                  checklist block
         {"title", "note"?, "form": [(group_title, [(label, span)...])], "cols"?}   fill-in lines
         {"callout": "<b>html</b> text"}                      standalone quiet note
    """
    subtitle = subtitle or "Document checklist. Please arrange copies of the items that apply to you."
    story = []
    kinds = set()
    two = columns == 2
    GAP = 8 * mm
    col_w = (CONTENT_W - GAP) / 2 if two else CONTENT_W
    if two:
        RichItem.SIZE, RichItem.LEAD, RichItem.VPAD = 8.3, 12.6, 1.5
    else:
        RichItem.SIZE, RichItem.LEAD, RichItem.VPAD = 8.8, 13.6, 1.8

    def item_flowables(items):
        out = []
        for n, raw in enumerate(items):
            if raw.startswith("## "):
                out.append(CondPageBreak(24 * mm))
                out.append(SubHead(raw[3:].strip()))
                continue
            it = RichItem(raw, last=(n == len(items) - 1))
            kinds.update(it.kinds())
            out.append(it)
        return out

    closing_box = None
    if closing:
        closing_box = callout(
            "<b>Send clear photos or scans of the documents that apply to you on WhatsApp, sorted by "
            "category.</b> This is an indicative list — exact requirements can vary by lender and profile, "
            f"and our team will confirm before login. Questions? Call {PHONE} or write to {EMAIL}.",
            col_w,
        )
    has_form = two and any("form" in sec for sec in sections)

    for sec in sections:
        if has_form and "form" in sec and closing_box is not None:
            story.append(closing_box)
            closing_box = None
        if "callout" in sec:
            story.append(callout(sec["callout"], col_w))
            story.append(Spacer(1, 3 * mm))
            continue
        if "form" in sec:
            if two:  # fill-in forms get a fresh full-width page
                story.append(NextPageTemplate("single"))
                story.append(PageBreak())
            story.append(CondPageBreak(34 * mm))
            story.append(SectionBar(sec["title"], sec.get("note")))
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
            flows = item_flowables(sec["items"])
            table = SectionTable(sec["title"], sec.get("note"), flows)
            if len(flows) <= (7 if two else 9):  # short section: keep it whole
                story.append(KeepTogether([table]))
            else:
                story.append(CondPageBreak(34 * mm))
                story.append(table)
        story.append(Spacer(1, 4.0 * mm if two else 4.6 * mm))

    if closing_box is not None:
        story.append(CondPageBreak(30 * mm))
        story.append(Spacer(1, 1 * mm))
        story.append(closing_box)

    meta = {"title": title, "subtitle": subtitle, "kinds": kinds}
    first_top = 50 * mm
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

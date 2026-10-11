"""Generate the public, text-selectable CV from its editable Markdown source."""
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).with_name("Abdullah-Al-Mahdi-CV.md")
OUTPUT = ROOT / "public/downloads/Abdullah-Al-Mahdi-CV.pdf"
FONT_DIR = Path("C:/Windows/Fonts")

if FONT_DIR.joinpath("arial.ttf").exists():
    pdfmetrics.registerFont(TTFont("CV", str(FONT_DIR / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("CV-Bold", str(FONT_DIR / "arialbd.ttf")))
    pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
    regular, bold = "CV", "CV-Bold"
else:
    regular, bold = "Helvetica", "Helvetica-Bold"

styles = {
    "body": ParagraphStyle("body", fontName=regular, fontSize=9.5, leading=12, spaceAfter=3, alignment=TA_LEFT),
    "name": ParagraphStyle("name", fontName=bold, fontSize=23, leading=27, spaceAfter=3),
    "section": ParagraphStyle("section", fontName=bold, fontSize=10.5, leading=14, spaceBefore=9, spaceAfter=3),
    "project": ParagraphStyle("project", fontName=bold, fontSize=10, leading=13, spaceBefore=5, spaceAfter=2),
    "bullet": ParagraphStyle("bullet", fontName=regular, fontSize=9.5, leading=12, leftIndent=9, firstLineIndent=-9, spaceAfter=3),
}


def markup(text):
    text = escape(text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" color="#254f78">\1</a>', text)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


story = []
for line in SOURCE.read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    if line.startswith("# "):
        story.append(Paragraph(markup(line[2:]), styles["name"]))
    elif line.startswith("## "):
        story.append(Paragraph(line[3:].upper(), styles["section"]))
        story.append(HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#b8bec4"), spaceAfter=4))
    elif line.startswith("### "):
        story.append(Paragraph(markup(line[4:]), styles["project"]))
    elif line.startswith("- "):
        story.append(Paragraph("- " + markup(line[2:]), styles["bullet"]))
    else:
        story.append(Paragraph(markup(line), styles["body"]))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, leftMargin=37, rightMargin=37,
    topMargin=30, bottomMargin=30,
    title="Abdullah Al Mahdi - Junior Front-End Developer",
    author="Abdullah Al Mahdi", subject="Front-End and Software Engineering CV",
)
document.build(story)
print(OUTPUT)

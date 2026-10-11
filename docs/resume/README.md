# Editable CV

Edit [Abdullah-Al-Mahdi-CV.md](Abdullah-Al-Mahdi-CV.md), then regenerate the downloadable PDF from the repository root:

```bash
python -m pip install reportlab
python docs/resume/build_resume.py
```

The generator writes `public/downloads/Abdullah-Al-Mahdi-CV.pdf`, the existing portfolio download location. It uses Arial when available on Windows and Helvetica elsewhere. Text and hyperlinks remain selectable; the single-column layout avoids tables and decorative icons. Render and inspect the PDF after edits, including its page count, wrapping, and links.

The original portfolio retains the previous CV and private backups. This showcase contains only the recruiter-facing Markdown, generator, and downloadable PDF. Do not add the original private DOCX or historical backups to public assets.

Facts come from the supplied resume and inspected repositories. Numeric performance claims without measurements were omitted. This edition removes code links to private project repositories while retaining verified live-project, profile, portfolio, and original-design links. Add source links only after the actual public editions exist; do not guess repository or deployment addresses.

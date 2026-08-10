"""Export safe, structured tables from the validated DOCX report."""

from __future__ import annotations

import json
from pathlib import Path

from docx import Document


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "juice-shop" / "Argus-Juice-Shop-Security-Validation.docx"
OUTPUT = Path(__file__).resolve().parents[1] / "app" / "report-data.json"

TABLE_NAMES = [
    "metrics",
    "severity",
    "categories",
    "top_rules",
    "top_files",
    "packages",
    "redaction_checks",
    "regex_detectors",
    "additional_detectors",
]


def table_records(table):
    headers = [cell.text.strip() for cell in table.rows[0].cells]
    return [
        {header: cell.text.strip() for header, cell in zip(headers, row.cells)}
        for row in table.rows[1:]
    ]


document = Document(REPORT)
payload = {
    name: table_records(table)
    for name, table in zip(TABLE_NAMES, document.tables, strict=True)
}
OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(OUTPUT)

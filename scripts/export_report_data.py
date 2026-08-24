"""Export safe, structured tables from the validated DOCX report."""

from __future__ import annotations

import json
from pathlib import Path

try:
    from docx import Document
except ImportError:  # detector inventory refresh does not require python-docx
    Document = None

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "juice-shop" / "Argus-Juice-Shop-Security-Validation.docx"
OUTPUT = Path(__file__).resolve().parents[1] / "app" / "report-data.json"
MATRIX = ROOT / "docs" / "attack-vector-matrix.md"

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


def detector_inventory():
    """Use the live generated matrix as the documentation inventory source."""
    regex_detectors = []
    additional_detectors = []
    for line in MATRIX.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|") or line.startswith("|---"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) != 10 or cells[0] in {"Detector", "SCA-*"}:
            continue
        rule, detection, severity, cwe, _category, languages, engine, *_ = cells
        if engine in {"regex-pattern", "iac"}:
            regex_detectors.append({
                "Rule": rule,
                "Detection": detection.replace("\\|", "|"),
                "Sev": severity,
                "CWE": f"CWE-{cwe}",
                "Languages": languages,
                "Seen": "N/E",
            })
        else:
            additional_detectors.append({
                "Rule": rule,
                "Engine": engine,
                "Detection": detection.replace("\\|", "|"),
                "Sev": severity,
                "CWE": f"CWE-{cwe}",
                "Scope": languages,
                "Seen": "N/E",
            })
    return regex_detectors, additional_detectors


if Document is not None:
    document = Document(REPORT)
    payload = {
        name: table_records(table)
        for name, table in zip(TABLE_NAMES, document.tables, strict=True)
    }
else:
    payload = json.loads(OUTPUT.read_text(encoding="utf-8"))
payload["regex_detectors"], payload["additional_detectors"] = detector_inventory()
OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(OUTPUT)

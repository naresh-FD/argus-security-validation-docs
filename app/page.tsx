"use client";

import { useMemo, useState } from "react";
import report from "./report-data.json";

type Detector = {
  id: string;
  detection: string;
  severity: string;
  cwe: string;
  scope: string;
  seen: string;
  kind: "Regex" | "Core" | "Optional";
  engine: string;
};

const leakLocations = [
  "data/static/codefixes/loginAdminChallenge_1.ts:18",
  "data/static/codefixes/loginAdminChallenge_2.ts:15",
  "data/static/codefixes/loginBenderChallenge_1.ts:18",
  "data/static/codefixes/loginBenderChallenge_3.ts:15",
  "data/static/codefixes/loginBenderChallenge_4.ts:15",
  "data/static/codefixes/loginJimChallenge_2.ts:15",
  "data/static/codefixes/loginJimChallenge_4.ts:18",
  "routes/login.ts:34",
];

const coverageGroups = [
  ["Secrets & sensitive data", "Private keys, cloud and SaaS tokens, database URLs, credential assignments, entropy and JWT-shaped literals, browser storage, secret logging, Docker secrets and JDBC passwords."],
  ["Injection & taint flow", "SQL and NoSQL injection, shell commands, eval and dynamic code, LDAP, XPath, SpEL, templates, path traversal, redirects, prototype pollution and Python or optional JS taint paths."],
  ["XSS & browser risks", "dangerouslySetInnerHTML, direct innerHTML writes, document.write, javascript: URLs, insecure storage and cookie security attributes."],
  ["SSRF & outbound requests", "User-controlled request URLs in pattern rules and taint-backed Python or optional JavaScript request sinks."],
  ["Cryptography & TLS", "Weak hashes, ciphers, modes, protocols and key sizes; certificate or hostname verification bypasses; fixed IVs or salts; insecure randomness and deprecated cipher APIs."],
  ["Identity & access", "JWT verification bypasses, weak password KDFs, permit-all authorization, client-controlled authorization decisions and IDOR-style lookups."],
  ["Deserialization & XXE", "Unsafe Python, Java and Node deserialization, risky YAML or XML APIs and missing external-entity controls."],
  ["Configuration & frameworks", "CORS, debug mode, CSRF, cleartext protocols, loose permissions, disclosure headers, wildcard hosts, Express and Spring framework risks."],
  ["Infrastructure as code", "Docker image, download, root-user and secret risks; GitHub Actions trust boundaries, permissions, mutable actions and secret echo; Kubernetes privilege and host exposure."],
  ["Dependencies & quality", "Mutable dependency declarations, OSV advisory matching, swallowed exceptions, leaked file handles, high complexity, long functions and regex denial of service."],
];

const recommendations = [
  "Fix and regression-test cross-rule secret redaction before publishing any Argus report to GitHub comments or artifacts.",
  "Add path-aware exclusions or a first-party mode so vendored assets do not dominate CFG002 output.",
  "Separate dependency-pinning policy from vulnerability findings in summaries and quality gates.",
  "Minimize the semantic-engine crash and pin a verified Python and tree-sitter compatibility matrix.",
  "Deduplicate by source location and rule family; use secret fingerprints for SARIF only after the P0 bypass is closed.",
  "Gate on validated high and critical code findings rather than raw total count.",
];

const nav = [
  ["overview", "Overview"],
  ["results", "Scan results"],
  ["redaction", "P0 redaction"],
  ["reliability", "Reliability"],
  ["coverage", "Coverage"],
  ["remediation", "Remediation"],
  ["method", "Method"],
];

function severityClass(severity: string) {
  return `severity severity-${severity.toLowerCase()}`;
}

export default function Home() {
  const detectors = useMemo<Detector[]>(() => {
    const regex = report.regex_detectors.map((row) => ({
      id: row.Rule,
      detection: row.Detection,
      severity: row.Sev,
      cwe: row.CWE,
      scope: row.Languages,
      seen: row.Seen,
      kind: "Regex" as const,
      engine: "Pattern rule",
    }));
    const additional = report.additional_detectors.map((row) => ({
      id: row.Rule,
      detection: row.Detection,
      severity: row.Sev,
      cwe: "—",
      scope: row.Scope,
      seen: row.Seen,
      kind: row.Engine === "Optional semantic" ? ("Optional" as const) : ("Core" as const),
      engine: row.Engine,
    }));
    return [...regex, ...additional];
  }, []);

  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [kind, setKind] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return detectors.filter((detector) => {
      const matchesQuery = !needle || [detector.id, detector.detection, detector.cwe, detector.scope, detector.engine]
        .some((value) => value.toLowerCase().includes(needle));
      const matchesSeverity = severity === "all" || detector.severity.toLowerCase() === severity;
      const matchesKind = kind === "all" || detector.kind.toLowerCase() === kind;
      return matchesQuery && matchesSeverity && matchesKind;
    });
  }, [detectors, kind, query, severity]);

  return (
    <div className="docs-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Argus validation documentation home">
          <span className="brand-mark">A</span>
          <span><strong>ARGUS</strong><small>Validation docs</small></span>
        </a>
        <div className="side-status"><span className="pulse" /> P0 validation failed</div>
        <nav aria-label="Documentation sections">
          {nav.map(([id, label], index) => (
            <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
          ))}
        </nav>
        <div className="side-meta">
          <p>Test target</p><strong>OWASP Juice Shop</strong>
          <p>Tested</p><strong>10 Aug 2026</strong>
          <a className="download-link" href="/Argus-Juice-Shop-Security-Validation.docx" download>Download DOCX report</a>
        </div>
      </aside>

      <main>
        <section className="hero" id="overview">
          <div className="eyebrow">EXTERNAL SECURITY VALIDATION / BUILD 9F5EB22</div>
          <div className="hero-grid">
            <div>
              <div className="status-pill">P0 · DO NOT PUBLISH</div>
              <h1>Argus security validation</h1>
              <p className="lede">A real-repository assessment against OWASP Juice Shop covering static analysis, dependency advisories, secret-redaction safety and semantic-engine resilience.</p>
            </div>
            <div className="verdict-card">
              <span>Executive verdict</span>
              <strong>Validation failed</strong>
              <p>Eight credential-bearing source lines survived through duplicate injection findings. PR-comment output remains unsafe until cross-rule redaction is fixed.</p>
            </div>
          </div>
          <div className="metric-grid" aria-label="Validation metrics">
            <article><span>Total findings</span><strong>714</strong><small>stable core + OSV</small></article>
            <article><span>High + critical</span><strong>133</strong><small>requires triage</small></article>
            <article><span>OSV advisories</span><strong>50</strong><small>across 17 packages</small></article>
            <article><span>Static detector IDs</span><strong>124</strong><small>84 regex + 40 additional</small></article>
          </div>
        </section>

        <section className="section" id="results">
          <div className="section-heading"><span>01</span><div><p>Benchmark output</p><h2>Scan results</h2></div></div>
          <div className="two-column">
            <div className="panel">
              <div className="panel-heading"><h3>Severity distribution</h3><span>714 total</span></div>
              <div className="severity-bar" aria-label="5 critical, 128 high, 224 medium and 357 low findings">
                <span className="bar-critical" style={{ width: "0.7%" }} />
                <span className="bar-high" style={{ width: "17.9%" }} />
                <span className="bar-medium" style={{ width: "31.4%" }} />
                <span className="bar-low" style={{ width: "50%" }} />
              </div>
              <div className="severity-legend">
                {report.severity.filter((row) => row.Severity !== "Info").map((row) => (
                  <div key={row.Severity}><span className={`dot dot-${row.Severity.toLowerCase()}`} /><strong>{row.Count}</strong><small>{row.Severity}</small></div>
                ))}
              </div>
              <p className="note">Signals include static, policy and advisory entries. They are not all independently confirmed vulnerabilities.</p>
            </div>
            <div className="panel">
              <div className="panel-heading"><h3>Signal concentration</h3><span>Top categories</span></div>
              <div className="category-list">
                {report.categories.slice(0, 7).map((row) => (
                  <div key={row.Category}><span>{row.Category}</span><div><i style={{ width: row.Share }} /></div><strong>{row.Count}</strong><small>{row.Share}</small></div>
                ))}
              </div>
              <p className="note">Configuration and dependency policy dominate the run. 311 CFG002 results come from one vendored three.js asset.</p>
            </div>
          </div>

          <div className="panel table-panel">
            <div className="panel-heading"><h3>Dependency advisories by package</h3><span>OSV · 17 packages</span></div>
            <div className="compact-grid">
              {report.packages.map((row) => <div key={row.Package}><span>{row.Package}</span><strong>{row["Advisory findings"]}</strong></div>)}
            </div>
          </div>
        </section>

        <section className="section danger-section" id="redaction">
          <div className="section-heading"><span>02</span><div><p>Acceptance criterion failed</p><h2>Secret-redaction bypass</h2></div></div>
          <div className="danger-callout">
            <div className="danger-code">P0</div>
            <div><strong>Credential literals re-entered both serialized report surfaces.</strong><p>The SEC003 copies were safely redacted and fingerprinted. The same lines also triggered INJ003 and INJ004; those independent Finding objects retained their original snippets because redaction classification was applied per finding rather than per source location.</p></div>
          </div>
          <div className="two-column">
            <div className="panel">
              <div className="panel-heading"><h3>Affected locations</h3><span>Values intentionally omitted</span></div>
              <ul className="code-list">{leakLocations.map((path) => <li key={path}><code>{path}</code></li>)}</ul>
            </div>
            <div className="panel">
              <div className="panel-heading"><h3>Required fix</h3><span>Before PR-comment use</span></div>
              <ol className="action-list">
                <li>Track secret-bearing source locations and sanitize every finding sharing the same path and line.</li>
                <li>Apply report-level text sanitization independently of finding classification.</li>
                <li>Regress SEC003 + INJ003 + INJ004 across raw state, JSON, Markdown and LLM payloads.</li>
                <li>Keep the current GitHub comment workflow disabled until the benchmark passes.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section" id="reliability">
          <div className="section-heading"><span>03</span><div><p>Native runtime stress test</p><h2>Semantic-engine reliability</h2></div></div>
          <div className="reliability-card">
            <div><span className="failure-label">FAIL</span><h3>Full-repository semantic scan crashed</h3><p>Windows access violation <code>-1073741819</code> reproduced without OSV and across the routes, data and frontend/src subtrees. The lib subtree completed.</p></div>
            <div className="reliability-facts"><div><strong>99 / 99</strong><span>tests passed with optional parsers</span></div><div><strong>3</strong><span>large subtrees reproduced the crash</span></div><div><strong>1</strong><span>subtree completed successfully</span></div></div>
          </div>
          <p className="section-copy">The unit suite validates normal parser paths, but not this corpus-scale native failure. Minimize the crashing input, add a large-corpus regression and pin a verified Python/tree-sitter compatibility matrix before enabling semantic scanning in CI.</p>
        </section>

        <section className="section" id="coverage">
          <div className="section-heading"><span>04</span><div><p>Detection surface</p><h2>What Argus catches and reports</h2></div></div>
          <p className="section-copy wide">Argus defines 124 static detector IDs: 84 pattern rules and 40 AST, taint, semantic, entropy, policy and quality detectors. Dynamic dependency scanning adds one <code>SCA-&lt;OSV ID&gt;</code> result per matched advisory.</p>
          <div className="coverage-grid">
            {coverageGroups.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>

          <div className="catalogue">
            <div className="catalogue-heading"><div><p>Complete catalogue</p><h3>Detector reference</h3></div><strong>{filtered.length} / {detectors.length}</strong></div>
            <div className="filters">
              <label className="search-field"><span>Search detectors</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rule ID, CWE, language or detection…" /></label>
              <label><span>Severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="all">All severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
              <label><span>Engine</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">All engines</option><option value="regex">Pattern rules</option><option value="core">Core analyzers</option><option value="optional">Optional semantic</option></select></label>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Rule</th><th>Detection</th><th>Engine</th><th>Severity</th><th>CWE</th><th>Scope</th><th>Seen</th></tr></thead>
                <tbody>
                  {filtered.map((detector) => <tr key={detector.id}><td><code>{detector.id}</code></td><td>{detector.detection}</td><td>{detector.engine}</td><td><span className={severityClass(detector.severity)}>{detector.severity}</span></td><td>{detector.cwe}</td><td>{detector.scope}</td><td>{detector.seen}</td></tr>)}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state">No detectors match these filters.</div>}
            </div>
          </div>
        </section>

        <section className="section" id="remediation">
          <div className="section-heading"><span>05</span><div><p>Prioritized work</p><h2>Recommended next actions</h2></div></div>
          <div className="recommendations">{recommendations.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>
        </section>

        <section className="section method-section" id="method">
          <div className="section-heading"><span>06</span><div><p>Reproducibility</p><h2>Method and sources</h2></div></div>
          <div className="method-grid">
            <div><h3>Scope</h3><p>Shallow clone of the official Juice Shop repository at commit <code>a520e158cb65c43d24e2c55d84f09b05a2511a03</code>. The intentionally vulnerable application was not built or executed.</p></div>
            <div><h3>Execution</h3><p>Stable stdlib scan, OSV dependency lookup, exact source-line redaction checks, isolated tree-sitter test environment and full-corpus semantic stress runs.</p></div>
            <div><h3>Safety</h3><p>Credential values are excluded from this site and the DOCX. Generated raw JSON and Markdown were deleted after disclosure was reproduced.</p></div>
          </div>
          <div className="source-links"><a href="https://github.com/juice-shop/juice-shop">Official benchmark repository</a><a href="https://owasp.org/www-project-juice-shop/">OWASP project page</a><a href="https://osv.dev/">OSV advisory service</a><a href="https://github.com/naresh-FD/Argus">Argus repository</a></div>
        </section>

        <footer><div><strong>ARGUS VALIDATION DOCS</strong><span>Evidence-backed security scanner assessment</span></div><a href="#overview">Back to top ↑</a></footer>
      </main>
    </div>
  );
}

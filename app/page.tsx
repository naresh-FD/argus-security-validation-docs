"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  CircleGauge,
  CodeXml,
  Cpu,
  DatabaseZap,
  ExternalLink,
  FileDown,
  FileSearch,
  FlaskConical,
  GitBranch,
  KeyRound,
  Link2,
  LockKeyhole,
  Menu,
  Monitor,
  Moon,
  PackageSearch,
  ScanSearch,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sun,
  UserRoundCheck,
  Wrench,
  X,
  type LucideIcon,
} from "./icons";
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

type Theme = "light" | "dark" | "system";

const themes: Array<{ id: Theme; label: string; icon: LucideIcon }> = [
  { id: "light", label: "Light theme", icon: Sun },
  { id: "dark", label: "Dark theme", icon: Moon },
  { id: "system", label: "Use system theme", icon: Monitor },
];

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

const coverageGroups: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Secrets & sensitive data", copy: "Private keys, cloud and SaaS tokens, database URLs, credential assignments, entropy and JWT-shaped literals, browser storage, secret logging, Docker secrets and JDBC passwords.", icon: KeyRound },
  { title: "Injection & taint flow", copy: "SQL and NoSQL injection, shell commands, eval and dynamic code, LDAP, XPath, SpEL, templates, path traversal, redirects, prototype pollution and Python or optional JS taint paths.", icon: GitBranch },
  { title: "XSS & browser risks", copy: "dangerouslySetInnerHTML, direct innerHTML writes, document.write, javascript: URLs, insecure storage and cookie security attributes.", icon: CodeXml },
  { title: "SSRF & outbound requests", copy: "User-controlled request URLs in pattern rules and taint-backed Python or optional JavaScript request sinks.", icon: Link2 },
  { title: "Cryptography & TLS", copy: "Weak hashes, ciphers, modes, protocols and key sizes; certificate or hostname verification bypasses; fixed IVs or salts; insecure randomness and deprecated cipher APIs.", icon: LockKeyhole },
  { title: "Identity & access", copy: "JWT verification bypasses, weak password KDFs, permit-all authorization, client-controlled authorization decisions and IDOR-style lookups.", icon: UserRoundCheck },
  { title: "Deserialization & XXE", copy: "Unsafe Python, Java and Node deserialization, risky YAML or XML APIs and missing external-entity controls.", icon: DatabaseZap },
  { title: "Configuration & frameworks", copy: "CORS, debug mode, CSRF, cleartext protocols, loose permissions, disclosure headers, wildcard hosts, Express and Spring framework risks.", icon: Settings2 },
  { title: "Infrastructure as code", copy: "Docker image, download, root-user and secret risks; GitHub Actions trust boundaries, permissions, mutable actions and secret echo; Kubernetes privilege and host exposure.", icon: Boxes },
  { title: "Dependencies & quality", copy: "Mutable dependency declarations, OSV advisory matching, swallowed exceptions, leaked file handles, high complexity, long functions and regex denial of service.", icon: PackageSearch },
];

const recommendations = [
  "Fix and regression-test cross-rule secret redaction before publishing any Argus report to GitHub comments or artifacts.",
  "Add path-aware exclusions or a first-party mode so vendored assets do not dominate CFG002 output.",
  "Separate dependency-pinning policy from vulnerability findings in summaries and quality gates.",
  "Minimize the semantic-engine crash and pin a verified Python and tree-sitter compatibility matrix.",
  "Deduplicate by source location and rule family; use secret fingerprints for SARIF only after the P0 bypass is closed.",
  "Gate on validated high and critical code findings rather than raw total count.",
];

const nav: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: CircleGauge },
  { id: "results", label: "Scan results", icon: BarChart3 },
  { id: "redaction", label: "P0 redaction", icon: KeyRound },
  { id: "reliability", label: "Reliability", icon: Cpu },
  { id: "coverage", label: "Coverage", icon: ScanSearch },
  { id: "remediation", label: "Remediation", icon: Wrench },
  { id: "method", label: "Method", icon: FlaskConical },
];

function severityClass(severity: string) {
  return `severity severity-${severity.toLowerCase()}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [theme, setTheme] = useState<Theme>("system");
  const firstNavLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("argus-theme");
    const selected: Theme = stored === "light" || stored === "dark" ? stored : "system";
    setTheme(selected);
    if (selected === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = selected;
  }, []);

  const selectTheme = (selected: Theme) => {
    setTheme(selected);
    if (selected === "system") {
      delete document.documentElement.dataset.theme;
      window.localStorage.removeItem("argus-theme");
    } else {
      document.documentElement.dataset.theme = selected;
      window.localStorage.setItem("argus-theme", selected);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("menu-locked", menuOpen);
    if (menuOpen) window.setTimeout(() => firstNavLink.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-locked");
    };
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: [0.05, 0.25, 0.5] },
    );
    nav.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Argus validation documentation home">
          <span className="brand-mark"><ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          <span><strong>ARGUS</strong><small>Validation docs</small></span>
        </a>
        <div className="theme-switch" role="group" aria-label="Color theme">
          {themes.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => selectTheme(id)} aria-label={label} title={label} aria-pressed={theme === id}>
              <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ))}
        </div>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="docs-nav" aria-label={menuOpen ? "Close documentation menu" : "Open documentation menu"}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <div className="side-status"><ShieldAlert size={15} aria-hidden="true" /> P0 validation failed</div>
        <nav id="docs-nav" className={menuOpen ? "mobile-open" : ""} aria-label="Documentation sections">
          <div className="mobile-nav-heading"><span>Explore documentation</span><strong>7 sections</strong></div>
          {nav.map(({ id, label, icon: Icon }, index) => (
            <a key={id} ref={index === 0 ? firstNavLink : undefined} href={`#${id}`} onClick={() => setMenuOpen(false)} aria-current={activeSection === id ? "location" : undefined}>
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" />{label}
            </a>
          ))}
          <div className="mobile-nav-footer"><span><ShieldAlert size={15} aria-hidden="true" /> P0 validation failed</span><a href="./Argus-Juice-Shop-Security-Validation.docx" download><FileDown size={16} aria-hidden="true" />Download evidence report</a></div>
        </nav>
        {menuOpen && <button className="menu-scrim" type="button" aria-label="Close documentation menu" onClick={() => setMenuOpen(false)} />}
        <div className="side-meta">
          <p>Test target</p><strong>OWASP Juice Shop</strong>
          <p>Tested</p><strong>10 Aug 2026</strong>
          <a className="download-link" href="./Argus-Juice-Shop-Security-Validation.docx" download><FileDown size={15} aria-hidden="true" />Download DOCX report</a>
        </div>
      </aside>

      <main id="main-content">
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
            <article><Activity className="metric-icon" size={20} aria-hidden="true" /><span>Total findings</span><strong>714</strong><small>stable core + OSV</small></article>
            <article><AlertTriangle className="metric-icon metric-risk" size={20} aria-hidden="true" /><span>High + critical</span><strong>133</strong><small>requires triage</small></article>
            <article><PackageSearch className="metric-icon" size={20} aria-hidden="true" /><span>OSV advisories</span><strong>50</strong><small>across 17 packages</small></article>
            <article><ScanSearch className="metric-icon" size={20} aria-hidden="true" /><span>Static detector IDs</span><strong>124</strong><small>84 regex + 40 additional</small></article>
          </div>
        </section>

        <section className="section" id="results">
          <div className="section-heading"><span className="section-icon"><BarChart3 aria-hidden="true" /></span><div><p>Benchmark output</p><h2>Scan results</h2></div></div>
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
            <div className="panel-heading"><h3 className="icon-title"><PackageSearch size={18} aria-hidden="true" />Dependency advisories by package</h3><span>OSV · 17 packages</span></div>
            <div className="compact-grid">
              {report.packages.map((row) => <div key={row.Package}><span>{row.Package}</span><strong>{row["Advisory findings"]}</strong></div>)}
            </div>
          </div>
        </section>

        <section className="section danger-section" id="redaction">
          <div className="section-heading"><span className="section-icon danger-icon"><KeyRound aria-hidden="true" /></span><div><p>Acceptance criterion failed</p><h2>Secret-redaction bypass</h2></div></div>
          <div className="danger-callout">
            <div className="danger-code"><ShieldAlert size={30} aria-hidden="true" /><span>P0</span></div>
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
          <div className="section-heading"><span className="section-icon"><Cpu aria-hidden="true" /></span><div><p>Native runtime stress test</p><h2>Semantic-engine reliability</h2></div></div>
          <div className="reliability-card">
            <div><span className="failure-label">FAIL</span><h3>Full-repository semantic scan crashed</h3><p>Windows access violation <code>-1073741819</code> reproduced without OSV and across the routes, data and frontend/src subtrees. The lib subtree completed.</p></div>
            <div className="reliability-facts"><div><strong>99 / 99</strong><span>tests passed with optional parsers</span></div><div><strong>3</strong><span>large subtrees reproduced the crash</span></div><div><strong>1</strong><span>subtree completed successfully</span></div></div>
          </div>
          <p className="section-copy">The unit suite validates normal parser paths, but not this corpus-scale native failure. Minimize the crashing input, add a large-corpus regression and pin a verified Python/tree-sitter compatibility matrix before enabling semantic scanning in CI.</p>
        </section>

        <section className="section" id="coverage">
          <div className="section-heading"><span className="section-icon"><ScanSearch aria-hidden="true" /></span><div><p>Detection surface</p><h2>What Argus catches and reports</h2></div></div>
          <p className="section-copy wide">Argus defines 124 static detector IDs: 84 pattern rules and 40 AST, taint, semantic, entropy, policy and quality detectors. Dynamic dependency scanning adds one <code>SCA-&lt;OSV ID&gt;</code> result per matched advisory.</p>
          <div className="coverage-grid">
            {coverageGroups.map(({ title, copy, icon: Icon }) => <article key={title}><span className="coverage-icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span><h3>{title}</h3><p>{copy}</p></article>)}
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
          <div className="section-heading"><span className="section-icon"><Wrench aria-hidden="true" /></span><div><p>Prioritized work</p><h2>Recommended next actions</h2></div></div>
          <div className="recommendations">{recommendations.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>
        </section>

        <section className="section method-section" id="method">
          <div className="section-heading"><span className="section-icon"><FlaskConical aria-hidden="true" /></span><div><p>Reproducibility</p><h2>Method and sources</h2></div></div>
          <div className="method-grid">
            <div><h3 className="icon-title"><FileSearch size={18} aria-hidden="true" />Scope</h3><p>Shallow clone of the official Juice Shop repository at commit <code>a520e158cb65c43d24e2c55d84f09b05a2511a03</code>. The intentionally vulnerable application was not built or executed.</p></div>
            <div><h3 className="icon-title"><FlaskConical size={18} aria-hidden="true" />Execution</h3><p>Stable stdlib scan, OSV dependency lookup, exact source-line redaction checks, isolated tree-sitter test environment and full-corpus semantic stress runs.</p></div>
            <div><h3 className="icon-title"><ShieldCheck size={18} aria-hidden="true" />Safety</h3><p>Credential values are excluded from this site and the DOCX. Generated raw JSON and Markdown were deleted after disclosure was reproduced.</p></div>
          </div>
          <div className="source-links"><a href="https://github.com/juice-shop/juice-shop">Official benchmark repository<ExternalLink size={14} aria-hidden="true" /></a><a href="https://owasp.org/www-project-juice-shop/">OWASP project page<ExternalLink size={14} aria-hidden="true" /></a><a href="https://osv.dev/">OSV advisory service<ExternalLink size={14} aria-hidden="true" /></a><a href="https://github.com/naresh-FD/Argus">Argus repository<ExternalLink size={14} aria-hidden="true" /></a></div>
        </section>

        <footer><div><strong>ARGUS VALIDATION DOCS</strong><span>Evidence-backed security scanner assessment</span></div><a href="#overview">Back to top ↑</a></footer>
      </main>
    </div>
  );
}

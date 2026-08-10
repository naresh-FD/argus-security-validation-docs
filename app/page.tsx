"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CodeXml,
  ExternalLink,
  FileDown,
  GitBranch,
  KeyRound,
  Link2,
  LockKeyhole,
  Menu,
  PackageSearch,
  Settings2,
  ShieldCheck,
  UserRoundCheck,
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

const navLinks = [
  { id: "overview", label: "Overview" },
  { id: "pipeline", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "usage", label: "Usage" },
  { id: "reference", label: "Detectors" },
];

const overviewCards: Array<{ title: string; copy: string; tone: string; icon: LucideIcon }> = [
  {
    title: "Code-aware analysis",
    copy: "Argus combines pattern rules, language-aware AST inspection and source-to-sink taint tracking so findings reflect how code actually behaves.",
    tone: "green",
    icon: CodeXml,
  },
  {
    title: "Layered security coverage",
    copy: "Scan application code, dependencies, Dockerfiles, Kubernetes manifests and GitHub Actions through one consistent finding model.",
    tone: "purple",
    icon: Boxes,
  },
  {
    title: "Zero source-code egress",
    copy: "Core analysis runs locally. Optional AI triage uses a local Ollama model, and sensitive values are redacted before reporting.",
    tone: "amber",
    icon: LockKeyhole,
  },
];

const pipeline = [
  { title: "Discover", copy: "Walk the repository, honor ignore rules and select the detector families that apply." },
  { title: "Analyze", copy: "Run pattern, AST, taint, infrastructure and optional dependency engines." },
  { title: "Triage", copy: "Dedupe signals, suppress test noise, redact secrets and rank findings by severity." },
  { title: "Deliver", copy: "Write Markdown or JSON, publish CI evidence and enforce the configured merge threshold." },
];

const featureCards: Array<{ title: string; copy: string; tone: string; icon: LucideIcon }> = [
  {
    title: "Multi-language scanning",
    copy: "Use one CLI across JavaScript, TypeScript, React, Java and Python repositories with language-aware rules.",
    tone: "green",
    icon: CodeXml,
  },
  {
    title: "Source-to-sink taint",
    copy: "Trace request data, arguments and environment values into SQL, commands, files, dynamic code and outbound URLs.",
    tone: "purple",
    icon: GitBranch,
  },
  {
    title: "Supply-chain and IaC checks",
    copy: "Inspect pinned packages through OSV and detect unsafe Docker, GitHub Actions and Kubernetes configuration.",
    tone: "amber",
    icon: PackageSearch,
  },
  {
    title: "Pull-request enforcement",
    copy: "Update one sticky PR comment, preserve a full report artifact and block merges at a chosen severity.",
    tone: "blue",
    icon: ShieldCheck,
  },
];

const coverageCards: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Secrets", copy: "Keys, tokens, database URIs, credentials and unsafe secret handling.", icon: KeyRound },
  { title: "Injection", copy: "SQL, NoSQL, OS commands, dynamic code, templates and redirects.", icon: GitBranch },
  { title: "Browser security", copy: "XSS sinks, insecure storage, cookies and client-side authorization.", icon: CodeXml },
  { title: "SSRF and paths", copy: "Tainted URLs, filesystem paths and outbound network destinations.", icon: Link2 },
  { title: "Identity and access", copy: "JWT bypasses, weak KDFs, permit-all authorization and IDOR patterns.", icon: UserRoundCheck },
  { title: "Configuration", copy: "CORS, CSRF, debug flags, permissions and cleartext protocols.", icon: Settings2 },
];

const validationItems = [
  {
    status: "Live",
    statusClass: "st-live",
    title: "Deterministic scanner and AST engine",
    copy: "The zero-dependency core ships with pattern, AST, entropy, policy and quality detectors for repeatable local scans.",
  },
  {
    status: "Live",
    statusClass: "st-live",
    title: "Taint, infrastructure and dependency coverage",
    copy: "Taint propagation, IaC checks and optional OSV advisories extend coverage beyond line-level matches.",
  },
  {
    status: "Optional",
    statusClass: "st-planned",
    title: "Local AI enrichment",
    copy: "High-risk findings can enter a bounded Ollama review loop without sending source code to a cloud model.",
  },
  {
    status: "Validated",
    statusClass: "st-progress",
    title: "OWASP Juice Shop benchmark",
    copy: "A 746-file benchmark produced 714 findings and exposed a historical secret-redaction regression retained as an acceptance test.",
  },
];

function severityClass(severity: string) {
  return `severity severity-${severity.toLowerCase()}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [kind, setKind] = useState("all");
  const [copied, setCopied] = useState(false);

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
      cwe: "-",
      scope: row.Scope,
      seen: row.Seen,
      kind: row.Engine === "Optional semantic" ? ("Optional" as const) : ("Core" as const),
      engine: row.Engine,
    }));
    return [...regex, ...additional];
  }, []);

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

  const copyInstall = async () => {
    await navigator.clipboard.writeText('pip install "git+https://github.com/naresh-FD/Argus.git@main"');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <nav className="topnav" aria-label="Primary navigation">
        <div className="wrap nav-inner">
          <a className="nav-logo" href="#overview" aria-label="Argus documentation home" onClick={closeMenu}>
            <span className="chip">A</span>
            <span>Argus</span>
          </a>
          <ul className="nav-links">
            {navLinks.map((link) => <li key={link.id}><a href={`#${link.id}`}>{link.label}</a></li>)}
          </ul>
          <span className="nav-badge">Open source · local-first</span>
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => <a key={link.id} href={`#${link.id}`} onClick={closeMenu}>{link.label}</a>)}
        <a href="https://github.com/naresh-FD/Argus" onClick={closeMenu}>GitHub repository</a>
      </div>

      <main id="main-content">
        <div className="wrap">
          <section className="hero" id="overview">
            <div>
              <div className="eyebrow">Local-first application security</div>
              <h1>Security risks, found <em>where your code lives.</em></h1>
              <p className="hero-lede">Argus is an agentic static security scanner for modern polyglot repositories. It combines deterministic rules, taint analysis, infrastructure checks, dependency advisories and optional local AI triage without sending your code to a cloud model.</p>
              <div className="pills" aria-label="Argus highlights">
                <span className="pill"><strong>124</strong> detector IDs</span>
                <span className="pill"><strong>100%</strong> local core</span>
                <span className="pill">CLI <strong>+ GitHub Actions</strong></span>
                <span className="pill">MIT licensed</span>
              </div>
            </div>

            <div className="terminal" aria-label="Argus command line example">
              <div className="term-bar">
                <div className="dots"><i /><i /><i /></div>
                <span className="term-label">argus scan · terminal</span>
                <span className="pass-badge">PASS</span>
              </div>
              <pre className="term-body"><code><span className="ck">$</span> argus ./src --check-deps --fail-on high{"\n\n"}<span className="cm">plan</span>       124 detectors selected{"\n"}<span className="cm">discover</span>   746 files accepted{"\n"}<span className="cm">analyze</span>    pattern · AST · taint · IaC{"\n"}<span className="cm">triage</span>     dedupe · redact · rank{"\n\n"}<span className="cs">✓ report written with safe snippets</span></code></pre>
            </div>
          </section>
        </div>

        <section className="section">
          <div className="wrap">
            <div className="sec-label">Overview</div>
            <h2>Built for teams that cannot send code outside</h2>
            <p className="sec-intro">Start with a deterministic, zero-dependency core and add deeper analysis only where your repository needs it.</p>
            <div className="grid-3">
              {overviewCards.map(({ title, copy, tone, icon: Icon }) => (
                <article className="card" key={title}>
                  <span className={`card-icon ${tone}`}><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" id="pipeline">
          <div className="wrap">
            <div className="sec-label">How it works</div>
            <h2>From repository to actionable report in four steps</h2>
            <p className="sec-intro">Every stage is explicit, bounded and usable through either LangGraph orchestration or the built-in sequential fallback.</p>
            <div className="pipeline" aria-label="Argus analysis pipeline">
              {pipeline.map((step, index) => (
                <article className="pipe-step" key={step.title}>
                  <span className="pipe-num">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="wrap">
            <div className="sec-label">Features</div>
            <h2>Everything you need from scan to merge</h2>
            <p className="sec-intro">Use one consistent workflow across source code, infrastructure, dependencies and pull-request enforcement.</p>
            <div className="grid-2">
              {featureCards.map(({ title, copy, tone, icon: Icon }) => (
                <article className="card feature-card" key={title}>
                  <span className={`card-icon ${tone}`}><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>

            <div className="subsection-heading">
              <div className="sec-label">Coverage</div>
              <h2>Security checks across the stack</h2>
            </div>
            <div className="coverage-grid">
              {coverageCards.map(({ title, copy, icon: Icon }) => (
                <article key={title}><span><Icon size={19} strokeWidth={2} aria-hidden="true" /></span><div><h3>{title}</h3><p>{copy}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" id="usage">
          <div className="wrap">
            <div className="sec-label">Quick start</div>
            <h2>Scan a repository in minutes</h2>
            <p className="sec-intro">The core scanner uses only the Python standard library. Semantic parsing, LangGraph orchestration and local Ollama enrichment are optional extras.</p>
            <div className="qs-grid">
              <div>
                <div className="code-panel">
                  <div className="code-panel-bar"><span>Install from GitHub</span><button type="button" onClick={copyInstall}>{copied ? "Copied" : "Copy"}</button></div>
                  <pre><code><span className="ck">$</span> pip install &quot;git+https://github.com/naresh-FD/Argus.git@main&quot;</code></pre>
                </div>
                <p className="qs-note">Core only: <code>pip install .</code> · Semantic: <code>pip install &quot;.[semantic]&quot;</code> · Agent + local AI: <code>pip install &quot;.[graph,llm]&quot;</code></p>
              </div>
              <div>
                <div className="code-panel">
                  <div className="code-panel-bar"><span>Common commands</span><span className="code-tag">CLI</span></div>
                  <pre><code><span className="cm"># Markdown report</span>{"\n"}<span className="ck">$</span> argus ./src{"\n\n"}<span className="cm"># JSON for automation</span>{"\n"}<span className="ck">$</span> argus . --format json -o out.json{"\n\n"}<span className="cm"># CI severity gate</span>{"\n"}<span className="ck">$</span> argus . --fail-on high</code></pre>
                </div>
              </div>
            </div>

            <div className="privacy-callout">
              <span className="callout-icon"><LockKeyhole size={24} aria-hidden="true" /></span>
              <div><h3>Your source code stays on your machine.</h3><p>Core scanning, AST analysis, taint tracking, triage and reporting execute locally. Optional AI enrichment targets a local Ollama endpoint. OSV is the only outbound service and runs only when dependency checking is enabled.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="validation">
          <div className="wrap">
            <div className="sec-label">Development and validation</div>
            <h2>Production-focused capabilities, with evidence</h2>
            <p className="sec-intro">Argus publishes both its working capabilities and the failure modes discovered during real-repository validation.</p>
            <div className="road-list">
              {validationItems.map((item, index) => (
                <article className={`road-item ${index === validationItems.length - 1 ? "road-item-active" : ""}`} key={item.title}>
                  <span className={`status ${item.statusClass}`}>{item.status}</span>
                  <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                </article>
              ))}
            </div>
            <div className="validation-actions">
              <a className="action-link" href="./Argus-Juice-Shop-Security-Validation.docx" download>Download the validation report <FileDown size={15} aria-hidden="true" /></a>
              <span><AlertTriangle size={15} aria-hidden="true" />Historical failures remain acceptance tests.</span>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="reference">
          <div className="wrap">
            <div className="sec-label">Detector reference</div>
            <h2>Search all built-in security detectors</h2>
            <p className="sec-intro">Filter by rule ID, CWE, language, engine or detection behavior. OSV matches are added dynamically when dependency scanning is enabled.</p>
            <div className="catalogue">
              <div className="catalogue-toolbar">
                <label><span>Search detectors</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rule ID, CWE, language or detection..." /></label>
                <label><span>Severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="all">All severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
                <label><span>Engine</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">All engines</option><option value="regex">Pattern rules</option><option value="core">Core analyzers</option><option value="optional">Optional semantic</option></select></label>
                <strong>{filtered.length} / {detectors.length}</strong>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Rule</th><th>Detection</th><th>Engine</th><th>Severity</th><th>CWE</th><th>Scope</th><th>Seen</th></tr></thead>
                  <tbody>{filtered.map((detector) => <tr key={detector.id}><td><code>{detector.id}</code></td><td>{detector.detection}</td><td>{detector.engine}</td><td><span className={severityClass(detector.severity)}>{detector.severity}</span></td><td>{detector.cwe}</td><td>{detector.scope}</td><td>{detector.seen}</td></tr>)}</tbody>
                </table>
                {filtered.length === 0 && <div className="empty-state">No detectors match these filters.</div>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>Argus · local-first application security scanning</span>
          <div><a href="#overview">Back to top</a><a href="https://github.com/naresh-FD/Argus">GitHub <ExternalLink size={13} aria-hidden="true" /></a></div>
        </div>
      </footer>
    </div>
  );
}

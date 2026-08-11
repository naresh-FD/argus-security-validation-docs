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

const navGroups = [
  {
    label: "Get started",
    items: [
      { id: "overview", label: "Overview", icon: CircleGauge },
      { id: "features", label: "Features", icon: Boxes },
      { id: "quickstart", label: "Quick start", icon: CodeXml },
      { id: "workflow", label: "How it works", icon: GitBranch },
    ],
  },
  {
    label: "Security platform",
    items: [
      { id: "coverage", label: "Detection coverage", icon: ScanSearch },
      { id: "cicd", label: "CI/CD integration", icon: ShieldCheck },
      { id: "privacy", label: "Privacy model", icon: LockKeyhole },
    ],
  },
  {
    label: "Evidence",
    items: [
      { id: "validation", label: "Validation lab", icon: FlaskConical },
      { id: "reference", label: "Detector reference", icon: FileSearch },
    ],
  },
];

const featureCards: Array<{ title: string; copy: string; meta: string; icon: LucideIcon }> = [
  { title: "Multi-language scanning", copy: "Scan JavaScript, TypeScript, React, Java and Python with language-aware rules and a consistent finding model.", meta: "One CLI across your stack", icon: CodeXml },
  { title: "Source-to-sink taint", copy: "Trace request data, environment values and arguments through assignments into SQL, commands, files, code execution and outbound requests.", meta: "Python core + optional JS/TS", icon: GitBranch },
  { title: "Secret-safe findings", copy: "Redact credential values before findings enter pipeline state, keep useful context and attach deterministic fingerprints for safe deduplication.", meta: "Fail-closed redaction", icon: KeyRound },
  { title: "IaC and dependency risk", copy: "Inspect Dockerfiles, GitHub Actions and Kubernetes manifests, then optionally check pinned packages against live OSV advisories.", meta: "Code + supply chain", icon: PackageSearch },
  { title: "Local AI triage", copy: "Send only selected high-severity findings to a local Ollama model for exploitability review—without a cloud model or API key.", meta: "Optional and on-device", icon: Cpu },
  { title: "Pull-request enforcement", copy: "Publish one sticky PR comment, upload the full report and block merges at a configurable severity threshold.", meta: "GitHub Actions ready", icon: ShieldCheck },
];

const pipeline = [
  { title: "Plan", copy: "Select detector families and rules." },
  { title: "Discover", copy: "Walk files while honoring ignore globs." },
  { title: "Analyze", copy: "Run pattern, AST, taint and IaC engines." },
  { title: "Dependencies", copy: "Optionally resolve pinned versions through OSV." },
  { title: "Triage", copy: "Dedupe, suppress test noise and rank severity." },
  { title: "Enrich", copy: "Optionally confirm high-risk findings with local Ollama." },
  { title: "Report", copy: "Render actionable Markdown or JSON." },
];

const coverageGroups: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Secrets", copy: "Keys, tokens, database URIs, credentials, entropy and unsafe secret handling.", icon: KeyRound },
  { title: "Injection", copy: "SQL, NoSQL, OS commands, dynamic code, LDAP, XPath, templates and redirects.", icon: GitBranch },
  { title: "Browser security", copy: "XSS sinks, insecure storage, cookie attributes and client-controlled authorization.", icon: CodeXml },
  { title: "SSRF and paths", copy: "Tainted request URLs, filesystem paths and outbound network destinations.", icon: Link2 },
  { title: "Crypto and TLS", copy: "Weak hashes, ciphers, protocols, key sizes, randomness and verification bypasses.", icon: LockKeyhole },
  { title: "Identity and access", copy: "JWT bypasses, weak KDFs, permit-all authorization and IDOR-style lookups.", icon: UserRoundCheck },
  { title: "Unsafe parsing", copy: "Deserialization, YAML and XML APIs, plus missing external-entity controls.", icon: DatabaseZap },
  { title: "Configuration", copy: "CORS, CSRF, debug flags, permissions, cleartext protocols and framework defaults.", icon: Settings2 },
  { title: "Infrastructure", copy: "Docker, GitHub Actions and Kubernetes privilege, trust and secret risks.", icon: Boxes },
  { title: "Dependencies and quality", copy: "OSV advisories, mutable versions, swallowed exceptions, complexity and ReDoS.", icon: Activity },
];

const allNav = navGroups.flatMap((group) => group.items);

function severityClass(severity: string) {
  return `severity severity-${severity.toLowerCase()}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [activeSection, setActiveSection] = useState("overview");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [kind, setKind] = useState("all");
  const [copied, setCopied] = useState(false);
  const firstNavLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("argus-theme");
    const selected: Theme = stored === "light" || stored === "dark" ? stored : "system";
    setTheme(selected);
    if (selected === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = selected;
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", close);
    document.body.classList.toggle("menu-locked", menuOpen);
    if (menuOpen) window.setTimeout(() => firstNavLink.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("menu-locked");
    };
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -72%", threshold: [0.05, 0.25, 0.5] },
    );
    allNav.forEach(({ id }) => {
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

  const copyInstall = async () => {
    await navigator.clipboard.writeText('pip install "git+https://github.com/naresh-FD/Argus.git@main"');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Argus documentation home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="brand-copy"><strong>ARGUS</strong><small>Security scanner</small></span>
        </a>

        <nav className="top-links" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#quickstart">Quick start</a>
          <a href="#coverage">Coverage</a>
          <a href="#cicd">CI/CD</a>
        </nav>

        <div className="top-actions">
          <div className="theme-switch" role="group" aria-label="Color theme">
            {themes.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => selectTheme(id)} aria-label={label} title={label} aria-pressed={theme === id}>
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            ))}
          </div>
          <a className="github-link" href="https://github.com/naresh-FD/Argus">GitHub <ExternalLink size={14} aria-hidden="true" /></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="docs-nav" aria-label={menuOpen ? "Close documentation menu" : "Open documentation menu"}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span>Menu</span>
          </button>
        </div>
      </header>

      <div className="docs-layout">
        <aside id="docs-nav" className={`docs-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Documentation sections">
          <div className="mobile-nav-heading"><strong>Documentation</strong><span>Argus v0.1</span></div>
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(({ id, label, icon: Icon }, index) => (
                <a key={id} ref={index === 0 && group === navGroups[0] ? firstNavLink : undefined} href={`#${id}`} onClick={() => setMenuOpen(false)} aria-current={activeSection === id ? "location" : undefined}>
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />{label}
                </a>
              ))}
            </div>
          ))}
          <div className="nav-note"><LockKeyhole size={16} aria-hidden="true" /><div><strong>Local-first by design</strong><span>Core analysis never uploads source code.</span></div></div>
        </aside>
        {menuOpen && <button className="menu-scrim" type="button" aria-label="Close documentation menu" onClick={() => setMenuOpen(false)} />}

        <main id="main-content">
          <section className="hero" id="overview">
            <div className="hero-copy">
              <div className="product-badge"><span>Open source</span> Local-first application security</div>
              <h1>Find security risks before they ship.</h1>
              <p>Argus is an agentic static security scanner for modern polyglot repositories. It combines deterministic rules, taint analysis, infrastructure checks, dependency advisories and optional local AI triage—without sending your code to a cloud model.</p>
              <div className="hero-local-first">
                <span className="hero-local-first-icon"><LockKeyhole size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                <div><strong>Local-first by design</strong><span>Core analysis never uploads source code.</span></div>
              </div>
              <div className="hero-top-features" aria-label="Top Argus features">
                <strong>Top features</strong>
                <ul>
                  <li><CodeXml size={16} aria-hidden="true" /><span>Multi-language SAST</span></li>
                  <li><GitBranch size={16} aria-hidden="true" /><span>Source-to-sink taint</span></li>
                  <li><PackageSearch size={16} aria-hidden="true" /><span>IaC + dependency checks</span></li>
                  <li><ShieldCheck size={16} aria-hidden="true" /><span>CI merge gates</span></li>
                </ul>
              </div>
              <div className="hero-actions">
                <a className="button button-primary" href="#quickstart">Get started <CodeXml size={17} aria-hidden="true" /></a>
                <a className="button button-secondary" href="https://github.com/naresh-FD/Argus">View repository <ExternalLink size={15} aria-hidden="true" /></a>
              </div>
            </div>

            <div className="hero-console" aria-label="Argus command line example">
              <div className="console-bar"><span /><span /><span /><strong>terminal</strong></div>
              <pre><code><span className="prompt">$</span> argus ./src --check-deps --fail-on high{"\n\n"}<span className="muted-code">plan</span>       124 detectors selected{"\n"}<span className="muted-code">discover</span>   746 files accepted{"\n"}<span className="muted-code">analyze</span>    pattern · AST · taint · IaC{"\n"}<span className="muted-code">triage</span>     dedupe · rank · remediate{"\n\n"}<span className="success-code">✓ report written with safe snippets</span></code></pre>
            </div>

            <div className="product-stats">
              <div><strong>124</strong><span>static detector IDs</span></div>
              <div><strong>3</strong><span>language ecosystems</span></div>
              <div><strong>0</strong><span>core runtime dependencies</span></div>
              <div><strong>100%</strong><span>local code analysis</span></div>
            </div>
          </section>

          <section className="section" id="features">
            <div className="section-intro"><span className="kicker">Platform features</span><h2>Everything you need from scan to merge</h2><p>Start with a zero-dependency deterministic core, then add deeper analysis only where your repository needs it.</p></div>
            <div className="feature-grid">
              {featureCards.map(({ title, copy, meta, icon: Icon }) => (
                <article className="feature-card" key={title}>
                  <span className="feature-icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3>{title}</h3><p>{copy}</p><small>{meta}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="section section-tinted" id="quickstart">
            <div className="section-intro"><span className="kicker">Quick start</span><h2>Scan a repository in minutes</h2><p>The core scanner uses only the Python standard library. Semantic parsing, LangGraph orchestration and Ollama enrichment are optional extras.</p></div>
            <div className="quickstart-grid">
              <div className="install-card">
                <div className="code-heading"><span>Install from GitHub</span><button type="button" onClick={copyInstall}>{copied ? "Copied" : "Copy"}</button></div>
                <pre><code>pip install &quot;git+https://github.com/naresh-FD/Argus.git@main&quot;</code></pre>
                <div className="install-options">
                  <div><strong>Core</strong><code>pip install .</code></div>
                  <div><strong>Semantic</strong><code>pip install &quot;.[semantic]&quot;</code></div>
                  <div><strong>Agent + local AI</strong><code>pip install &quot;.[graph,llm]&quot;</code></div>
                </div>
              </div>
              <div className="command-list">
                <div><code>argus ./src</code><span>Markdown report to stdout</span></div>
                <div><code>argus . --format json -o out.json</code><span>Machine-readable output</span></div>
                <div><code>argus . --fail-on high</code><span>Fail a CI job on high-risk findings</span></div>
                <div><code>argus . --check-deps</code><span>Add OSV dependency advisories</span></div>
                <div><code>argus . --use-llm</code><span>Enrich findings with local Ollama</span></div>
              </div>
            </div>
          </section>

          <section className="section" id="workflow">
            <div className="section-intro"><span className="kicker">Agent workflow</span><h2>Deterministic first. Intelligent when useful.</h2><p>Every stage is explicit, bounded and usable through either LangGraph orchestration or the built-in sequential fallback.</p></div>
            <div className="pipeline" aria-label="Argus analysis pipeline">
              {pipeline.map((step, index) => <article key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}
            </div>
            <div className="workflow-note"><Cpu size={20} aria-hidden="true" /><div><strong>Local enrichment is conditional</strong><p>Only high-severity, unconfirmed findings enter the optional Ollama loop, with a maximum of two triage iterations. No cloud API is required.</p></div></div>
          </section>

          <section className="section section-tinted" id="coverage">
            <div className="section-intro"><span className="kicker">Detection coverage</span><h2>Security coverage across code, configuration and supply chain</h2><p>Argus defines 84 pattern rules plus 40 AST, taint, semantic, entropy, policy and quality detectors. OSV matches are added dynamically when dependency scanning is enabled.</p></div>
            <div className="coverage-grid">
              {coverageGroups.map(({ title, copy, icon: Icon }) => <article key={title}><span><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
            </div>
            <a className="inline-link" href="#reference">Explore all 124 detector IDs <ExternalLink size={14} aria-hidden="true" /></a>
          </section>

          <section className="section" id="cicd">
            <div className="section-intro"><span className="kicker">CI/CD integration</span><h2>Turn findings into a merge decision</h2><p>The included GitHub Actions workflow keeps review feedback readable while preserving the full evidence trail.</p></div>
            <div className="ci-grid">
              <div className="ci-features">
                <article><ShieldCheck size={21} aria-hidden="true" /><div><h3>One sticky PR comment</h3><p>Updates the same comment on every run instead of creating review noise.</p></div></article>
                <article><AlertTriangle size={21} aria-hidden="true" /><div><h3>Configurable severity gate</h3><p>Block a merge at info, low, medium, high or critical.</p></div></article>
                <article><FileDown size={21} aria-hidden="true" /><div><h3>Complete report artifact</h3><p>Keep detailed findings and remediation outside the compact PR summary.</p></div></article>
                <article><GitBranch size={21} aria-hidden="true" /><div><h3>Changed-files mode</h3><p>Limit analysis to pull-request changes when fast feedback matters most.</p></div></article>
              </div>
              <div className="workflow-code">
                <div className="code-heading"><span>.github/workflows/argus.yml</span><strong>YAML</strong></div>
                <pre><code><span className="yaml-key">name:</span> Argus PR Scan{"\n"}<span className="yaml-key">on:</span> [pull_request]{"\n\n"}<span className="yaml-key">steps:</span>{"\n"}  - <span className="yaml-key">uses:</span> actions/checkout@v4{"\n"}  - <span className="yaml-key">run:</span> pip install .{"\n"}  - <span className="yaml-key">run:</span> argus . --fail-on high</code></pre>
              </div>
            </div>
          </section>

          <section className="section privacy-section" id="privacy">
            <div className="privacy-card">
              <div><span className="privacy-icon"><LockKeyhole size={25} aria-hidden="true" /></span><span className="kicker">Privacy model</span><h2>Your source code stays on your machine.</h2><p>Core scanning, AST analysis, taint tracking, triage and reporting execute locally. Optional AI enrichment targets a local Ollama endpoint.</p></div>
              <ul>
                <li><ShieldCheck size={17} aria-hidden="true" /><span><strong>Zero-dependency core</strong> uses Python’s standard library.</span></li>
                <li><ShieldCheck size={17} aria-hidden="true" /><span><strong>No cloud LLM</strong> receives source or finding context.</span></li>
                <li><ShieldCheck size={17} aria-hidden="true" /><span><strong>Secret values are redacted</strong> before pipeline state and report output.</span></li>
                <li><Activity size={17} aria-hidden="true" /><span><strong>OSV is the only outbound service</strong> and runs only with <code>--check-deps</code>.</span></li>
              </ul>
            </div>
          </section>

          <section className="section section-tinted" id="validation">
            <div className="section-intro"><span className="kicker">Validation lab</span><h2>Real-repository evidence, kept in context</h2><p>Argus was exercised against OWASP Juice Shop to measure signal volume, redaction behavior and semantic-engine resilience. This is a historical benchmark snapshot—not the product homepage.</p></div>
            <div className="validation-grid">
              <div className="validation-summary">
                <span className="lab-label">OWASP Juice Shop · 10 Aug 2026</span>
                <h3>714 findings across 746 scanned files</h3>
                <p>The run surfaced 133 high/critical signals and 50 OSV advisories. It also identified a pre-fix cross-rule secret-redaction regression retained here as security evidence.</p>
                <a className="button button-secondary" href="./Argus-Juice-Shop-Security-Validation.docx" download>Download validation report <FileDown size={16} aria-hidden="true" /></a>
              </div>
              <div className="validation-metrics">
                <div><strong>714</strong><span>Total findings</span></div>
                <div><strong>133</strong><span>High + critical</span></div>
                <div><strong>50</strong><span>OSV advisories</span></div>
                <div><strong>8</strong><span>Historical leak locations</span></div>
              </div>
            </div>
            <div className="evidence-note"><ShieldAlert size={19} aria-hidden="true" /><p><strong>Why keep a failed benchmark?</strong> Security tooling should publish its failure modes. The planted-secret regression is retained as a permanent acceptance test and evidence for the redaction hardening work.</p></div>
          </section>

          <section className="section" id="reference">
            <div className="section-intro"><span className="kicker">Complete catalogue</span><h2>Detector reference</h2><p>Search every built-in detector by rule ID, CWE, language, engine or detection behavior.</p></div>
            <div className="catalogue">
              <div className="catalogue-toolbar">
                <label className="search-field"><span>Search detectors</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rule ID, CWE, language or detection…" /></label>
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

            <div className="resource-row">
              <a href="https://github.com/naresh-FD/Argus">Argus repository <ExternalLink size={14} aria-hidden="true" /></a>
              <a href="https://github.com/juice-shop/juice-shop">Benchmark repository <ExternalLink size={14} aria-hidden="true" /></a>
              <a href="https://osv.dev/">OSV advisory service <ExternalLink size={14} aria-hidden="true" /></a>
            </div>
          </section>

          <footer><div><span className="brand-mark"><ShieldCheck size={19} aria-hidden="true" /></span><div><strong>ARGUS</strong><p>Local-first application security scanning.</p></div></div><div><a href="#overview">Back to top</a><a href="https://github.com/naresh-FD/Argus">GitHub</a></div></footer>
        </main>
      </div>
    </div>
  );
}

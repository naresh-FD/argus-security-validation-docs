import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the validation documentation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Argus Security Validation/);
  assert.match(html, /P0.*DO NOT PUBLISH/);
  assert.match(html, /Secret-redaction bypass/);
  assert.match(html, /What Argus catches and reports/);
  assert.match(html, /124/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("ships safe report data and the downloadable evidence report", async () => {
  const [page, layout, packageJson, reportData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/report-data.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Detector reference/);
  assert.match(layout, /Argus Security Validation/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|codex-preview/);
  assert.equal(JSON.parse(reportData).regex_detectors.length, 84);
  assert.equal(JSON.parse(reportData).additional_detectors.length, 40);
  await access(new URL("../public/Argus-Juice-Shop-Security-Validation.docx", import.meta.url));
});

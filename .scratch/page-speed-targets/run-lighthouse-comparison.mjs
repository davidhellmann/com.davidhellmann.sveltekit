import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = ".scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass";
const rawDir = path.join(outDir, "raw");
const reportPath = ".scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass.md";
const chromePath =
  "/Users/davidhellmann/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const pages = [
  { name: "Home", slug: "home", url: "https://davidhellmann.com/", baseline: { mobile: 71, desktop: 90 } },
  { name: "Blog listing", slug: "blog-listing", url: "https://davidhellmann.com/blog", baseline: { mobile: 84, desktop: 97 } },
  { name: "Work listing", slug: "work-listing", url: "https://davidhellmann.com/work", baseline: { mobile: 76, desktop: 99 } },
  { name: "Photos listing", slug: "photos-listing", url: "https://davidhellmann.com/photos", baseline: { mobile: 57, desktop: 86 } },
  {
    name: "Blog detail",
    slug: "blog-detail",
    url: "https://davidhellmann.com/blog/tailwindcss-fluid-type-plugin",
    baseline: { mobile: 97, desktop: 100 }
  },
  {
    name: "Work detail",
    slug: "work-detail",
    url: "https://davidhellmann.com/work/rb-leipzig",
    baseline: { mobile: 78, desktop: 98 }
  },
  {
    name: "Photos detail",
    slug: "photos-detail",
    url: "https://davidhellmann.com/photos/july-randoms-2026-07-06",
    baseline: { mobile: 86, desktop: 99 }
  }
];

const strategies = ["mobile", "desktop"];
const runsPerStrategy = 3;

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const score = (value) => Math.round(value * 100);
const ms = (value) => (typeof value === "number" ? value : undefined);
const seconds = (value) => (typeof value === "number" ? `${(value / 1000).toFixed(1)} s` : "n/a");
const millis = (value) => (typeof value === "number" ? `${Math.round(value)} ms` : "n/a");
const delta = (value) => (value > 0 ? `+${value}` : `${value}`);
const targetFor = (strategy) => (strategy === "desktop" ? 100 : 90);

const runLighthouse = (page, strategy, runNumber, outputPath) =>
  new Promise((resolve, reject) => {
    const args = [
      "-y",
      "lighthouse@13.4.0",
      page.url,
      "--only-categories=performance",
      "--output=json",
      `--output-path=${outputPath}`,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-gpu",
      "--max-wait-for-load=45000"
    ];

    if (strategy === "desktop") {
      args.push("--preset=desktop");
    }

    const child = spawn("npx", args, {
      env: { ...process.env, CHROME_PATH: chromePath },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Lighthouse failed for ${page.name} ${strategy} run ${runNumber}: ${stderr}`));
    });
  });

const readResult = async (page, strategy, runNumber, outputPath) => {
  const data = JSON.parse(await readFile(outputPath, "utf8"));
  const audits = data.audits;

  if (data.runtimeError || typeof data.categories.performance.score !== "number") {
    throw new Error(`Invalid Lighthouse report: ${outputPath}`);
  }

  if (
    typeof audits["first-contentful-paint"]?.numericValue !== "number" ||
    typeof audits["largest-contentful-paint"]?.numericValue !== "number"
  ) {
    throw new Error(`Incomplete Lighthouse report: ${outputPath}`);
  }

  return {
    page: page.name,
    slug: page.slug,
    url: page.url,
    strategy,
    run: runNumber,
    score: score(data.categories.performance.score),
    fcp: ms(audits["first-contentful-paint"]?.numericValue),
    lcp: ms(audits["largest-contentful-paint"]?.numericValue),
    tbt: ms(audits["total-blocking-time"]?.numericValue),
    cls: audits["cumulative-layout-shift"]?.numericValue,
    speedIndex: ms(audits["speed-index"]?.numericValue),
    ttfb: ms(audits["server-response-time"]?.numericValue),
    totalBytes: audits["total-byte-weight"]?.numericValue,
    imageBytes: audits["resource-summary"]?.details?.items?.find((item) => item.resourceType === "image")?.transferSize,
    outputPath
  };
};

const readExistingResult = async (page, strategy, runNumber, outputPath) => {
  try {
    return await readResult(page, strategy, runNumber, outputPath);
  } catch {
    return undefined;
  }
};

const summarize = (results) =>
  pages.flatMap((page) =>
    strategies.map((strategy) => {
      const runs = results.filter((result) => result.slug === page.slug && result.strategy === strategy);
      const scores = runs.map((run) => run.score);
      const medianScore = median(scores);
      const target = targetFor(strategy);
      const lowestAllowed = target - 2;

      return {
        page: page.name,
        url: page.url,
        strategy,
        baseline: page.baseline[strategy],
        runs,
        scores,
        medianScore,
        scoreDelta: medianScore - page.baseline[strategy],
        target,
        pass: medianScore >= target && Math.min(...scores) >= lowestAllowed,
        medianRun: runs.find((run) => run.score === medianScore) ?? runs[0]
      };
    })
  );

const renderMarkdown = (summary) => {
  const now = new Date().toISOString();
  const lines = [
    "# Lighthouse After Image/LCP Pass",
    "",
    `Measured on ${now} with Lighthouse 13.4.0 against public production URLs.`,
    "",
    "Google PageSpeed Insights API was unavailable without an API key again: unauthenticated API quota is `0/day`. This report therefore uses the same Lighthouse lab method as the 2026-07-08 baseline, not the final PSI acceptance gate.",
    "",
    "Run rule used here: 3 runs per URL and strategy. The shown score is the median run. Target status follows the map rule: Desktop `100`, Mobile `>= 90`, and no individual run more than 2 points below target.",
    "",
    "## Score Comparison",
    "",
    "| Page | Mode | Baseline | Runs | Median | Delta | Target | Status |",
    "| --- | --- | ---: | --- | ---: | ---: | --- | --- |"
  ];

  for (const item of summary) {
    lines.push(
      `| ${item.page} | ${item.strategy} | ${item.baseline} | ${item.scores.join(", ")} | ${item.medianScore} | ${delta(item.scoreDelta)} | ${item.target} | ${item.pass ? "Pass" : "Miss"} |`
    );
  }

  lines.push(
    "",
    "## Median Lab Metrics",
    "",
    "| Page | Mode | FCP | LCP | TBT | CLS | Speed Index | TTFB | Total bytes | Image bytes |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
  );

  for (const item of summary) {
    const run = item.medianRun;
    lines.push(
      `| ${item.page} | ${item.strategy} | ${seconds(run.fcp)} | ${seconds(run.lcp)} | ${millis(run.tbt)} | ${run.cls?.toFixed(3) ?? "n/a"} | ${seconds(run.speedIndex)} | ${millis(run.ttfb)} | ${Math.round((run.totalBytes ?? 0) / 1024).toLocaleString("en-US")} KiB | ${Math.round((run.imageBytes ?? 0) / 1024).toLocaleString("en-US")} KiB |`
    );
  }

  lines.push("", "## Tested URLs", "");

  for (const page of pages) {
    lines.push(`- ${page.name}: \`${page.url}\``);
  }

  lines.push("", "## Raw Reports", "");

  for (const item of summary) {
    for (const run of item.runs) {
      lines.push(`- ${item.page} ${item.strategy} run ${run.run}: \`${run.outputPath}\``);
    }
  }

  lines.push("");
  return lines.join("\n");
};

await mkdir(rawDir, { recursive: true });

const results = [];

for (const page of pages) {
  for (const strategy of strategies) {
    for (let runNumber = 1; runNumber <= runsPerStrategy; runNumber += 1) {
      const outputPath = path.join(rawDir, `${page.slug}-${strategy}-${runNumber}.json`);
      const existingResult = await readExistingResult(page, strategy, runNumber, outputPath);
      if (existingResult) {
        console.log(`[${page.name}] ${strategy} run ${runNumber}/${runsPerStrategy} already exists`);
        results.push(existingResult);
        continue;
      }

      console.log(`[${page.name}] ${strategy} run ${runNumber}/${runsPerStrategy}`);
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          await runLighthouse(page, strategy, runNumber, outputPath);
          break;
        } catch (error) {
          if (attempt === 3) throw error;
          console.log(`[${page.name}] ${strategy} run ${runNumber}/${runsPerStrategy} retry ${attempt + 1}/3`);
        }
      }
      results.push(await readResult(page, strategy, runNumber, outputPath));
    }
  }
}

const summary = summarize(results);
await writeFile(reportPath, renderMarkdown(summary));
console.log(`Wrote ${reportPath}`);

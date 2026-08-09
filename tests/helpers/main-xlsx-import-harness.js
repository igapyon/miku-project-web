import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { vi } from "vitest";

import { runtimeCode } from "./runtime-code.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainIoCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-io.js"),
  "utf8"
);
const mainImportCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-import.js"),
  "utf8"
);
const mainExportCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-export.js"),
  "utf8"
);
const mainInputEventsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-input-events.js"),
  "utf8"
);
const mainButtonEventsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-button-events.js"),
  "utf8"
);
const mainEventsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-events.js"),
  "utf8"
);
const mainPreviewCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-preview.js"),
  "utf8"
);
const mainUiCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-ui.js"),
  "utf8"
);
const mainSupportCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-support.js"),
  "utf8"
);
const mainSamplesCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-samples.js"),
  "utf8"
);
const mainDownloadsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-downloads.js"),
  "utf8"
);
const mainOutputActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-output-actions.js"),
  "utf8"
);
const mainImportActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-import-actions.js"),
  "utf8"
);
const mainXmlActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-xml-actions.js"),
  "utf8"
);
const mainArchiveActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-archive-actions.js"),
  "utf8"
);
const mainSaveStateCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-save-state.js"),
  "utf8"
);
const mainTabActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-tab-actions.js"),
  "utf8"
);
const mainPreviewActionsCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-preview-actions.js"),
  "utf8"
);
const mainTransformCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-transform.js"),
  "utf8"
);
const mainFlowCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-flow.js"),
  "utf8"
);
const mainModelCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-model.js"),
  "utf8"
);
const mainRenderCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main-render.js"),
  "utf8"
);
const mainCode = readFileSync(
  path.resolve(__dirname, "../../src/js/main.js"),
  "utf8"
);

export const dependencyXml = readFileSync(
  path.resolve(__dirname, "../../testdata/dependency.xml"),
  "utf8"
);
export const workbookImportSampleJson = readFileSync(
  path.resolve(__dirname, "../../testdata/workbook-import-sample.json"),
  "utf8"
);

const projectPatchJsonStubCode = `
globalThis.__mikuprojectProjectPatchJson = {
  importProjectPatchJson: () => ({ model: null, changes: [], warnings: [] })
};
`;

const wbsXlsxStubCode = `
globalThis.__mikuprojectWbsXlsx = {
  collectWbsHolidayDates: () => [],
  exportWbsWorkbook: () => ({ sheets: [] })
};
`;

const wbsMarkdownStubCode = `
globalThis.__mikuprojectWbsMarkdown = {
  exportWbsMarkdown: () => "# stub"
};
`;

const nativeSvgStubCode = `
globalThis.__mikuprojectNativeSvg = {
  exportNativeSvg: () => "<svg data-stub=\\"daily\\"></svg>",
  exportWeeklyNativeSvg: () => "<svg data-stub=\\"weekly\\"></svg>",
  exportMonthlyWbsCalendarSvgArchive: () => ({
    entries: [{ fileName: "2026-03.svg", svg: "<svg data-stub=\\"monthly\\"></svg>" }],
    zipBytes: new Uint8Array()
  })
};
`;

const bootPageCode = `${runtimeCode}\n${projectPatchJsonStubCode}\n${wbsXlsxStubCode}\n${wbsMarkdownStubCode}\n${nativeSvgStubCode}\n${mainIoCode}\n${mainImportCode}\n${mainExportCode}\n${mainInputEventsCode}\n${mainButtonEventsCode}\n${mainEventsCode}\n${mainPreviewCode}\n${mainUiCode}\n${mainSupportCode}\n${mainSamplesCode}\n${mainDownloadsCode}\n${mainOutputActionsCode}\n${mainImportActionsCode}\n${mainXmlActionsCode}\n${mainArchiveActionsCode}\n${mainSaveStateCode}\n${mainTabActionsCode}\n${mainPreviewActionsCode}\n${mainTransformCode}\n${mainFlowCode}\n${mainModelCode}\n${mainRenderCode}\n${mainCode}`;
const bootPageRunner = new Function(bootPageCode);

function mountDom() {
  document.body.innerHTML = `
    <button id="importFileBtn" type="button"></button>
    <button id="loadSampleBtn" type="button"></button>
    <button id="downloadAllOutputsBtn" type="button"></button>
    <button id="exportXlsxBtn" type="button"></button>
    <button id="exportWorkbookJsonBtn" type="button"></button>
    <button id="exportCsvBtn" type="button"></button>
    <button id="exportWbsXlsxBtn" type="button"></button>
    <button id="exportWbsMdBtn" type="button"></button>
    <button id="downloadWeeklySvgBtn" type="button"></button>
    <button id="downloadMonthlyCalendarSvgBtn" type="button"></button>
    <button id="exportMermaidMdBtn" type="button"></button>
    <button id="downloadSvgBtn" type="button"></button>
    <button id="previewDailySvgBtn" type="button"></button>
    <button id="previewWeeklySvgBtn" type="button"></button>
    <button id="previewMonthlySvgBtn" type="button"></button>
    <button id="exportAiBundleBtn" type="button"></button>
    <button id="exportProjectOverviewBtn" type="button"></button>
    <button id="exportTaskEditBtn" type="button"></button>
    <button id="exportPhaseDetailFullBtn" type="button"></button>
    <button id="exportPhaseDetailBtn" type="button"></button>
    <button id="loadProjectDraftSampleBtn" type="button"></button>
    <button id="importProjectDraftBtn" type="button"></button>
    <button id="downloadXmlBtn" type="button"></button>
    <button id="roundTripBtn" type="button"></button>
    <button id="copyAiPromptBtn" type="button"></button>
    <input id="importFileInput" type="file" />
    <input id="phaseDetailUidInput" type="text" />
    <input id="taskEditUidInput" type="text" />
    <input id="phaseDetailRootUidInput" type="text" />
    <input id="phaseDetailMaxDepthInput" type="text" />
    <input id="wbsDisplayDaysBeforeInput" />
    <input id="wbsDisplayDaysAfterInput" />
    <input id="wbsBusinessDayRangeInput" type="checkbox" />
    <input id="wbsBusinessDayProgressInput" type="checkbox" />
    <div id="statusMessage"></div>
    <div class="md-top-tabs">
      <button type="button" class="md-top-tab is-active" data-tab="input"></button>
      <button type="button" class="md-top-tab" data-tab="transform"></button>
      <button type="button" class="md-top-tab" data-tab="output"></button>
    </div>
    <section id="tabPanelInput" class="md-tab-panel" data-tab-panel="input">
      <textarea id="xmlInput"></textarea>
      <template id="aiPromptTemplate"># miku-project AI JSON Spec</template>
      <textarea id="projectDraftImportInput"></textarea>
      <div id="xmlSaveState"></div>
    </section>
    <section id="tabPanelTransform" class="md-tab-panel" data-tab-panel="transform" hidden>
      <div id="summaryProjectName"></div>
      <div id="summaryTaskCount"></div>
      <div id="summaryResourceCount"></div>
      <div id="summaryAssignmentCount"></div>
      <div id="summaryCalendarCount"></div>
      <div class="md-feedback-stack">
        <div class="md-label md-hidden">検証結果</div>
        <div id="validationIssues" class="md-hidden"></div>
        <div class="md-label md-hidden">import warnings</div>
        <div id="importWarnings" class="md-hidden"></div>
        <div class="md-label md-hidden">import summary</div>
        <div id="xlsxImportSummary" class="md-hidden"></div>
      </div>
      <div id="projectPreview"></div>
      <div id="taskPreview"></div>
      <div id="resourcePreview"></div>
      <div id="assignmentPreview"></div>
      <div id="calendarPreview"></div>
      <textarea id="modelOutput"></textarea>
      <textarea id="mermaidOutput"></textarea>
      <div id="wbsPreviewTitle"></div>
      <div id="wbsPreviewRange"></div>
      <div id="nativeSvgPreview"></div>
    </section>
    <section id="tabPanelOutput" class="md-tab-panel" data-tab-panel="output" hidden>
      <textarea id="workbookJsonOutput"></textarea>
      <textarea id="aiBundleOutput"></textarea>
      <textarea id="projectOverviewOutput"></textarea>
      <textarea id="phaseDetailOutput"></textarea>
    </section>
    <div id="toast"></div>
  `;
  const toast = document.getElementById("toast");
  toast.show = vi.fn();
}

export function bootPage() {
  mountDom();
  bootPageRunner();
  document.dispatchEvent(new Event("DOMContentLoaded"));
}

export function getMainHooks() {
  return globalThis.__mikuprojectMainTestHooks;
}

export function parseXmlViaHook() {
  getMainHooks().parseCurrentXml();
}

export async function flushAsyncWork() {
  await Promise.resolve();
  await Promise.resolve();
}

export function setImportFiles(file) {
  const importInput = document.getElementById("importFileInput");
  Object.defineProperty(importInput, "files", {
    configurable: true,
    value: [file]
  });
  importInput.dispatchEvent(new Event("change"));
}

export function setupMainXlsxImportDom() {
  document.body.innerHTML = "";
  Object.defineProperty(URL, "createObjectURL", {
    value: vi.fn(() => "blob:mock"),
    configurable: true
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    value: vi.fn(),
    configurable: true
  });
  HTMLAnchorElement.prototype.click = vi.fn();
  const clipboard = {
    writeText: vi.fn(async () => {})
  };
  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: clipboard,
    configurable: true
  });
  Object.defineProperty(window.navigator, "clipboard", {
    value: clipboard,
    configurable: true
  });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-16T23:12:00+09:00"));
}

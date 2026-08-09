import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { vi } from "vitest";

import { runtimeCode } from "./runtime-code.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainIoCode = readFileSync(path.resolve(__dirname, "../../src/js/main-io.js"), "utf8");
const mainImportCode = readFileSync(path.resolve(__dirname, "../../src/js/main-import.js"), "utf8");
const mainExportCode = readFileSync(path.resolve(__dirname, "../../src/js/main-export.js"), "utf8");
const mainInputEventsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-input-events.js"), "utf8");
const mainButtonEventsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-button-events.js"), "utf8");
const mainEventsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-events.js"), "utf8");
const mainPreviewCode = readFileSync(path.resolve(__dirname, "../../src/js/main-preview.js"), "utf8");
const mainUiCode = readFileSync(path.resolve(__dirname, "../../src/js/main-ui.js"), "utf8");
const mainSupportCode = readFileSync(path.resolve(__dirname, "../../src/js/main-support.js"), "utf8");
const mainSamplesCode = readFileSync(path.resolve(__dirname, "../../src/js/main-samples.js"), "utf8");
const mainDownloadsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-downloads.js"), "utf8");
const mainOutputActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-output-actions.js"), "utf8");
const mainImportActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-import-actions.js"), "utf8");
const mainXmlActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-xml-actions.js"), "utf8");
const mainArchiveActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-archive-actions.js"), "utf8");
const mainSaveStateCode = readFileSync(path.resolve(__dirname, "../../src/js/main-save-state.js"), "utf8");
const mainTabActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-tab-actions.js"), "utf8");
const mainPreviewActionsCode = readFileSync(path.resolve(__dirname, "../../src/js/main-preview-actions.js"), "utf8");
const mainTransformCode = readFileSync(path.resolve(__dirname, "../../src/js/main-transform.js"), "utf8");
const mainFlowCode = readFileSync(path.resolve(__dirname, "../../src/js/main-flow.js"), "utf8");
const mainModelCode = readFileSync(path.resolve(__dirname, "../../src/js/main-model.js"), "utf8");
const mainRenderCode = readFileSync(path.resolve(__dirname, "../../src/js/main-render.js"), "utf8");
const mainCode = readFileSync(path.resolve(__dirname, "../../src/js/main.js"), "utf8");
const bootPageCode = `${runtimeCode}\n${mainIoCode}\n${mainImportCode}\n${mainExportCode}\n${mainInputEventsCode}\n${mainButtonEventsCode}\n${mainEventsCode}\n${mainPreviewCode}\n${mainUiCode}\n${mainSupportCode}\n${mainSamplesCode}\n${mainDownloadsCode}\n${mainOutputActionsCode}\n${mainImportActionsCode}\n${mainXmlActionsCode}\n${mainArchiveActionsCode}\n${mainSaveStateCode}\n${mainTabActionsCode}\n${mainPreviewActionsCode}\n${mainTransformCode}\n${mainFlowCode}\n${mainModelCode}\n${mainRenderCode}\n${mainCode}`;
const bootPageRunner = new Function(bootPageCode);
const bootXmlModuleCode = `${runtimeCode}\n`;
const bootXmlModuleRunner = new Function(bootXmlModuleCode);

export const hierarchyXml = readFileSync(path.resolve(__dirname, "../../testdata/hierarchy.xml"), "utf8");
export const SAMPLE_HOLIDAY_COUNT = 1;

function mountDom() {
  document.body.innerHTML = `
    <button id="importFileBtn" type="button">Load from file</button>
    <button id="loadSampleBtn" type="button">サンプル</button>
    <button id="downloadAllOutputsBtn" type="button">All</button>
    <button id="exportXlsxBtn" type="button">XLSX</button>
    <button id="exportWorkbookJsonBtn" type="button">JSON</button>
    <button id="exportCsvBtn" type="button">CSV</button>
    <button id="exportWbsXlsxBtn" type="button">WBS XLSX</button>
    <button id="exportWbsMdBtn" type="button">WBS Markdown</button>
    <button id="downloadWeeklySvgBtn" type="button" disabled>Weekly SVG</button>
    <button id="downloadMonthlyCalendarSvgBtn" type="button" disabled>Monthly Calendar SVG</button>
    <button id="exportMermaidMdBtn" type="button">Mermaid</button>
    <button id="downloadSvgBtn" type="button" disabled>Daily SVG</button>
    <button id="previewDailySvgBtn" type="button">Daily SVG</button>
    <button id="previewWeeklySvgBtn" type="button">Weekly SVG</button>
    <button id="previewMonthlySvgBtn" type="button">Monthly Calendar SVG</button>
    <button id="exportAiBundleBtn" type="button">project_overview + all phase_detail full</button>
    <button id="exportProjectOverviewBtn" type="button">project_overview_view</button>
    <button id="exportTaskEditBtn" type="button">task_edit_view</button>
    <button id="exportPhaseDetailFullBtn" type="button">phase_detail_view full</button>
    <button id="exportPhaseDetailBtn" type="button">phase_detail_view</button>
    <button id="loadProjectDraftSampleBtn" type="button">サンプル draft</button>
    <button id="importProjectDraftBtn" type="button">project_draft_view を取り込む</button>
    <button id="downloadXmlBtn" type="button">MS Project XML</button>
    <button id="roundTripBtn" type="button">Round Trip</button>
    <button id="copyAiPromptBtn" type="button">Copy AI Prompt</button>
    <input id="importFileInput" type="file" />
    <input id="phaseDetailUidInput" type="text" />
    <input id="taskEditUidInput" type="text" />
    <input id="phaseDetailRootUidInput" type="text" />
    <input id="phaseDetailMaxDepthInput" type="text" />
    <div id="statusMessage"></div>
    <div class="md-top-tabs" role="tablist" aria-label="miku-project sections">
      <button type="button" class="md-top-tab is-active" data-tab="input" role="tab" aria-selected="true" aria-controls="tabPanelInput"></button>
      <button type="button" class="md-top-tab" data-tab="transform" role="tab" aria-selected="false" aria-controls="tabPanelTransform"></button>
      <button type="button" class="md-top-tab" data-tab="output" role="tab" aria-selected="false" aria-controls="tabPanelOutput"></button>
    </div>
    <section id="tabPanelInput" class="md-flow-section md-tab-panel" data-tab-panel="input">
      <textarea id="xmlInput"></textarea>
      <template id="aiPromptTemplate"># miku-project AI JSON Spec</template>
      <textarea id="projectDraftImportInput"></textarea>
      <div id="xmlSaveState"></div>
    </section>
    <section id="tabPanelTransform" class="md-flow-section md-tab-panel" data-tab-panel="transform" hidden>
      <div id="summaryProjectName"></div>
      <div id="summaryTaskCount"></div>
      <div id="summaryResourceCount"></div>
      <div id="summaryAssignmentCount"></div>
      <div id="summaryCalendarCount"></div>
      <div class="md-feedback-stack md-hidden">
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
      <input id="wbsDisplayDaysBeforeInput" />
      <input id="wbsDisplayDaysAfterInput" />
      <input id="wbsBusinessDayRangeInput" type="checkbox" />
      <input id="wbsBusinessDayProgressInput" type="checkbox" />
    </section>
    <section id="tabPanelOutput" class="md-flow-section md-tab-panel" data-tab-panel="output" hidden>
      <textarea id="workbookJsonOutput"></textarea>
      <textarea id="aiBundleOutput"></textarea>
      <textarea id="projectOverviewOutput"></textarea>
      <textarea id="taskEditOutput"></textarea>
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

export function bootXmlModule() {
  bootXmlModuleRunner();
  return globalThis.__mikuprojectXml;
}

export function getMainHooks() {
  return globalThis.__mikuprojectMainTestHooks;
}

export function parseXmlViaHook() {
  getMainHooks().parseCurrentXml();
}

export async function exportMermaidViaHook() {
  await getMainHooks().exportCurrentMermaid();
}

export function getDefaultSampleHolidayDates() {
  return globalThis.__mikuprojectWbsXlsx.collectWbsHolidayDates(
    globalThis.__mikuprojectXml.importMsProjectXml(globalThis.__mikuprojectXml.SAMPLE_XML)
  );
}

export async function flushAsyncWork() {
  await Promise.resolve();
  await Promise.resolve();
}

export function setupMainPreviewExportDom() {
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
  const clipboard = { writeText: vi.fn(async () => {}) };
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

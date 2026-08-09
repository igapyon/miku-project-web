export const WEB_MODULE_RELATIVE_PATHS = Object.freeze([
  "src/js/main-io.js",
  "src/js/main-import.js",
  "src/js/main-export.js",
  "src/js/main-input-events.js",
  "src/js/main-button-events.js",
  "src/js/main-events.js",
  "src/js/main-preview.js",
  "src/js/main-ui.js",
  "src/js/main-support.js",
  "src/js/main-samples.js",
  "src/js/main-downloads.js",
  "src/js/main-output-actions.js",
  "src/js/main-import-actions.js",
  "src/js/main-xml-actions.js",
  "src/js/main-archive-actions.js",
  "src/js/main-save-state.js",
  "src/js/main-tab-actions.js",
  "src/js/main-preview-actions.js",
  "src/js/main-transform.js",
  "src/js/main-flow.js",
  "src/js/main-model.js",
  "src/js/main-render.js",
  "src/js/main.js"
]);

export const WEB_TYPESCRIPT_RELATIVE_PATHS = Object.freeze(
  WEB_MODULE_RELATIVE_PATHS.map((relativePath) =>
    relativePath.replace("src/js/", "src/ts/").replace(/\.js$/, ".ts")
  )
);

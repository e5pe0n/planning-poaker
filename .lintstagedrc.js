const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

const prettierCmd = "prettier --write --ignore-unknown";

module.exports = {
  "*.{js,jsx,ts,tsx}": [prettierCmd, buildEslintCommand],
  "*.json": [prettierCmd],
};

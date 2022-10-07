module.exports = {
  extends: "@istanbuljs/nyc-config-typescript",
  all: true,
  "check-coverage": true,
  extension: [".ts"],
  include: ["src/**/*.ts"],
  reporter: ["text", "html"],
  statements: 100,
  branches: 100,
  functions: 100,
  lines: 100,
};

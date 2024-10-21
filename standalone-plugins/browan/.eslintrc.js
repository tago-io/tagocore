module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
      experimentalObjectRestSpread: true
    },
  },
  plugins: ["import"],
  ignorePatterns: ["build", "esbuild"],
  extends: [
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "eslint:recommended",
  ],
  rules: {
    "import/order": "error",
    "no-unused-vars": 0,
  },
};

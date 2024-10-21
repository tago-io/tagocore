export default {
  moduleDirectories: [
    "node_modules",
    "utils",
    __dirname,
  ],
  modulePathIgnorePatterns: ["./build-tsc"],
  testEnvironment: "jsdom",
  setupFiles: ["./utils/setup-jest.tsx"],
  transform: {
    '^.+\\.tsx?$': "ts-jest",
    ".+\\.(css|svg|gif|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  }
};

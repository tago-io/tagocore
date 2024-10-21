export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/packages", "<rootDir>/plugins"],
  testRegex: "(/__tests__/.*|(\\.|/)test)\\.ts?$",
};

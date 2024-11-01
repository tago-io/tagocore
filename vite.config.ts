import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cdk.out/**",
      "**/build/**",
      "**/console/**",
      "packages/server/Plugins/Plugin/Plugin.test.ts",
      "plugins/postgres/src/__tests__/health_check.test.ts",
      "plugins/mysql/src/__tests__/device/create.test.ts",
      "plugins/mysql/src/__tests__/health_check.test.ts",
    ],
  },
});

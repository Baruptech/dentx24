
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Ignore generated files, local backups, and build output.
  globalIgnores([
    ".history/**",
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    ".vercel/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from 'typescript-eslint'; // Import typescript-eslint
import eslintConfigPrettier from "eslint-config-prettier"; // Import prettier config

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Base Next.js configs from FlatCompat
const baseConfigs = compat.extends("next/core-web-vitals", "next/typescript");

const eslintConfig = [
  ...baseConfigs, // Spread the base configs first

  // Apply recommended TypeScript rules using tseslint.config
  // This replaces the need for separate parser and plugin configuration in many cases
  ...tseslint.configs.recommended,

  // Prettier configuration must be last to override other formatting rules
  eslintConfigPrettier,
];

export default eslintConfig;

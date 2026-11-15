import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // TypeScript's checker owns Node's globals (`process`), so the JS rule would only fire falsely.
    files: ["**/*.ts"],
    rules: { "no-undef": "off" },
  },
);

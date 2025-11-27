import tseslint from "@typescript-eslint/eslint-plugin";
import expoConfig from "eslint-config-expo/flat.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  ...expoConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "@typescript-eslint": tseslint,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/order": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react"],
            ["^react-native"],
            ["^@?\\w"],
            ["^@/components"],
            ["^@/hooks"],
            ["^@/types"],
            ["^@/styles", "^@/utils", "^@/constants", "^@/assets"],
            ["^@/"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
];

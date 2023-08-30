/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  trailingComma: "none",
  arrowParens: "avoid",
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "^react",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/components/(.*)$",
    "^@/hooks/(.*)$",
    "^@/lib/(.*)$",
    "^@/styles/(.*)$",
    "^@/env.mjs",
    "^[./]",
  ],
  importOrderBuiltinModulesToTop: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;

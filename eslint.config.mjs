import next from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "src/**",
      "netlify/**",
      "dist/**",
      ".next/**",
      "node_modules/**",
      "vite.config.ts",
      "vite.config.d.ts",
      "tailwind.config.js",
      "postcss.config.js",
    ],
  },
  ...next,
  ...coreWebVitals,
  ...typescript,
];

export default config;

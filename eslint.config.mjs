// eslint.config.mjs
// Root ESLint config — compose per-project
//
// Layer order matters:
//   1. love     — strict TypeScript base (sets the floor)
//   2. common   — shared overrides + import rules (cross-project consistency)
//   3. <project>— architecture rules specific to this project type
//   4. prettier — formatting (always last, disables conflicting style rules)
//
// To use: copy this file to the project root and uncomment the relevant import.

import love from "eslint-config-love";
import prettierRecommended from "eslint-plugin-prettier/recommended";

import commonRules from "./eslint.common.mjs";
// Uncomment the one that matches this project:
// import projectRules from './eslint.backend.mjs'
// import projectRules from './eslint.mobile.mjs'
// import projectRules from './eslint.web.mjs'
import projectRules from "./eslint.landing.mjs";

export default [
  {
    ignores: [
      "eslint.config.mjs",
      "eslint.common.mjs",
      "eslint.mobile.mjs",
      "eslint.landing.mjs",
      "eslint.web.mjs",
      "eslint.backend.mjs",
      "dist/**",
      "build/**",
      "node_modules/**",
      ".expo/**",
      "coverage/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "postcss.config.mjs",
      ".astro/**",
    ],
  },
  love,
  ...commonRules,
  ...projectRules,
  prettierRecommended, // always last — must override any style rules above
];

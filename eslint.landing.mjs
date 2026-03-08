// eslint.landing.mjs
// Architecture enforcement — Landing (Astro + optional React islands)
//
// Assumes eslint.common.mjs is already spread before this config.
// Only declares rules specific to the landing/Astro architecture.
//
// Required packages:
//   npm i -D eslint eslint-config-love prettier \
//     eslint-plugin-prettier eslint-config-prettier \
//     eslint-plugin-astro eslint-plugin-import eslint-import-resolver-typescript \
//     eslint-plugin-jsx-a11y eslint-plugin-react \
//     @typescript-eslint/parser @typescript-eslint/eslint-plugin

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

export default [
  // ─── Astro files — recommended config ─────────────────────────────────────
  ...astro.configs.recommended,

  // ─── TypeScript + React islands ───────────────────────────────────────────
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      "jsx-a11y": a11y,
      react,
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // ─── Structural boundaries ─────────────────────────────────────────────

      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Astro Content Collections must be accessed via API — never raw file imports
            {
              group: ["*/content/*.md", "*/content/*.mdx"],
              message:
                "Use Astro Content Collections API (getCollection/getEntry) — never import content files directly",
            },
            // Global styles are not for component-level import — use Tailwind tokens
            {
              group: ["*/styles/*"],
              message:
                "Never import from styles/ in components — use Tailwind tokens instead",
            },
          ],
          paths: [
            // Redux in islands must be justified — prefer local state for island-scoped interactions
            {
              name: "react-redux",
              importNames: ["useSelector", "useDispatch"],
              message:
                "Redux hooks allowed only in islands with shared cross-component state — prefer useState for island-scoped interactions",
            },
          ],
        },
      ],

      // ─── Syntax restrictions ───────────────────────────────────────────────
      "no-restricted-syntax": [
        "warn",

        // Astro convention — process.env not available in Astro files
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Use import.meta.env instead of process.env — this is the Astro/Vite convention",
        },

        // Raw <img> bypasses Astro's image optimization pipeline
        {
          selector: "JSXOpeningElement[name.name='img']",
          message:
            "Use <Image> from astro:assets for automatic optimization — avoid raw <img> in islands",
        },
      ],

      // ─── Circular dependencies ─────────────────────────────────────────────
      // Landing pages are simpler — stricter cycle limit makes sense
      "import/no-cycle": ["error", { maxDepth: 3, ignoreExternal: true }],

      // ─── Accessibility — landings are public-facing ────────────────────────
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",

      // ─── Design system ─────────────────────────────────────────────────────
      // Inline styles bypass Tailwind design tokens
      "react/forbid-component-props": [
        "warn",
        {
          forbid: [
            {
              propName: "style",
              message:
                "Avoid inline styles — use Tailwind tokens. If unavoidable, add a comment explaining why.",
            },
          ],
        },
      ],
    },
  },

  // ─── Astro frontmatter — process.env forbidden ────────────────────────────
  {
    files: ["src/**/*.astro"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "process",
          message: "Use import.meta.env instead of process.env in Astro files",
        },
      ],
    },
  },

  // ─── Relaxed rules for spec files ─────────────────────────────────────────
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-syntax": "off",
    },
  },
];

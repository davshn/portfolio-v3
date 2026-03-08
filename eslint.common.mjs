// eslint.common.mjs
// Shared rules across all project types (Backend, Mobile, Web, Landing)
//
// Philosophy:
//   - Only declares rules that OVERRIDE eslint-config-love defaults
//   - Each override includes a comment explaining why
//   - Do NOT import love here — this is spread into each project config
//     after love and before prettierRecommended
//
// Usage in eslint.config.mjs:
//   import love from 'eslint-config-love'
//   import commonRules from './lint/eslint.common.mjs'
//   import backendRules from './lint/eslint.backend.mjs'
//   import prettierRecommended from 'eslint-plugin-prettier/recommended'
//
//   export default [
//     ...love,
//     ...commonRules,
//     ...backendRules,
//     prettierRecommended,   // always last
//   ]

import importPlugin from "eslint-plugin-import";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // ─── TypeScript overrides ──────────────────────────────────────────────
      // These explicitly override love defaults — do not remove comments.

      // love sets this to 'error'. We relax to 'warn' in the common layer
      // because app/presentation layers legitimately use any for API responses
      // before they're typed. Domain-specific configs override this back to 'error'.
      "@typescript-eslint/no-explicit-any": "warn",

      // love includes this but without the underscore ignore pattern.
      // We need _param convention for unused destructured args and interface stubs.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // love enables this. We keep it on but allow type annotations in declarations
      // because domain value objects need explicit type annotations for clarity.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "inline-type-imports",
        },
      ],

      // love sets this to 'error'. Keep as error — silent async failures are
      // the #1 source of hard-to-debug production bugs across all project types.
      "@typescript-eslint/no-floating-promises": "error",

      // Not in love by default. Warn globally, each project can escalate to error.
      // Domain layers override this to 'error' in their own config blocks.
      "@typescript-eslint/no-non-null-assertion": "warn",

      // love does not enforce this. Explicit return types on public APIs prevent
      // accidental type widening when refactoring.
      "@typescript-eslint/explicit-module-boundary-types": [
        "warn",
        {
          allowedNames: [
            // Lifecycle hooks — return type is inferred by framework contracts
            "onModuleInit",
            "onApplicationBootstrap",
            "onModuleDestroy", // NestJS
            "componentDidMount",
            "componentWillUnmount", // React class
          ],
        },
      ],

      // ─── Import hygiene ────────────────────────────────────────────────────

      // Detects circular dependencies. maxDepth is conservative — each project
      // config can tighten this. External packages are excluded (they're tested).
      "import/no-cycle": ["error", { maxDepth: 6, ignoreExternal: true }],

      // Prevent the same module being imported twice in one file.
      "import/no-duplicates": "error",

      // Obvious but worth enforcing explicitly.
      "import/no-self-import": "error",

      // Enforce consistent import ordering — works with Prettier on save.
      // Groups: Node built-ins → external packages → internal aliases → relative paths
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node:fs, node:path
            "external", // react, @nestjs/*, expo-*
            "internal", // @modules/*, @shared/*, path aliases
            "parent", // ../something
            "sibling", // ./something
            "index", // ./
            "object", // import * as x
            "type", // import type { X }
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            // Treat internal aliases as 'internal' group (before relative imports)
            { pattern: "@modules/**", group: "internal", position: "before" },
            { pattern: "@shared/**", group: "internal", position: "before" },
            { pattern: "@app/**", group: "internal", position: "before" },
            { pattern: "@common/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["type"],
        },
      ],

      // ─── Common syntax restrictions ────────────────────────────────────────
      "no-restricted-syntax": [
        "error",

        // process.env forbidden everywhere — each project has its own config abstraction.
        // Backend: ConfigService / Mobile: Constants.expoConfig / Web: env helper / Landing: import.meta.env
        // Each project config adds the framework-specific message via override.
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Never access process.env directly — use the config abstraction for your project type.",
        },
      ],
    },
  },

  // ─── Relaxed rules for all spec/test files ─────────────────────────────────
  // Individual project configs may add more relaxations on top of these.
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "import/no-cycle": "off", // mocks often create intentional cycles
      "import/order": "warn", // relax to warn — test files are noisy enough
    },
  },
];

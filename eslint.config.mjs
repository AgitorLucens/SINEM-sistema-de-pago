import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import-x';

/*
    ESLint flat config — see ARCHITECTURE.md (added in a later phase).

    Scope rules by runtime:
      - src/main.js + src/domain/**   → Node (Electron main process, ESM)
      - src/preload.js                → CommonJS (preload script)
      - src/ui/** + src/App.jsx       → Browser (React renderer, ESM + JSX)
      - *.test.* + src/test/**        → Vitest (globals: true)

    MAIN_WINDOW_VITE_DEV_SERVER_URL and MAIN_WINDOW_VITE_NAME are injected
    at build time by @electron-forge/plugin-vite, so they are declared here
    instead of being defined in code.
*/
export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'release-builds/**',
            '.vite/**',
            'coverage/**',
            'out/**',
        ],
    },
    js.configs.recommended,
    {
        files: ['src/main.js', 'src/preload.js', 'src/domain/**/*.js', 'src/ipc/**/*.js', 'src/splash.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: { ...globals.node },
        },
    },
    {
        // Build-time constants injected by the Forge Vite plugin
        files: ['src/main.js'],
        languageOptions: {
            globals: {
                MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly',
                MAIN_WINDOW_VITE_NAME: 'readonly',
                __dirname: 'readonly',
            },
        },
    },
    {
        files: ['src/ui/**/*.{js,jsx}', 'src/App.jsx', 'src/renderer.jsx'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser },
        },
    },
    {
        files: ['src/**/*.test.{js,jsx}', 'src/test/**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                // vitest.config.mjs sets test.globals = true
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                vi: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
            },
        },
    },
    {
        files: ['*.mjs', 'forge.config.js', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: { ...globals.node },
        },
    },
    {
        plugins: { 'import-x': importPlugin },
        settings: {
            // 'electron' resolves to a binary at lint time; treat as core module
            'import-x/core-modules': ['electron'],
            // Vite resolves extensionless imports of .jsx components; mirror that here
            'import-x/resolver': {
                node: { extensions: ['.js', '.jsx', '.mjs', '.cjs'] },
            },
        },
        rules: {
            'import-x/no-unresolved': 'warn',
            'import-x/no-duplicates': 'warn',
            'import-x/named': 'warn',
        },
    },
    {
        // The warning backlog was cleared; unused vars are errors again.
        rules: {
            'no-unused-vars': ['error', { args: 'none' }],
        },
    },
];

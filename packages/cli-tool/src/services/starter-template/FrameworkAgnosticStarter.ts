import path from 'path';
import fs from 'fs-extra';
import { logger } from '../../utils/logger';

type PackageJson = Record<string, any>;
// Utility functions to create various configuration files and project structure
export async function createUniversalPackageJson(root: string): Promise<void> {
  const pkgPath = path.join(root, 'package.json');
  let pkg: PackageJson = {};

  if (await fs.pathExists(pkgPath)) {
    try {
      pkg = await fs.readJSON(pkgPath);
      logger.info('Existing package.json found – merging starter scripts and dependencies.');
    } catch {
      logger.warn('Unable to parse package.json, generating a fresh one.');
    }
  }

  const starterPkg: PackageJson = {
    name: pkg.name || 'ignix-universal-app',
    version: pkg.version || '0.1.0',
    private: pkg.private ?? true,
    type: pkg.type || 'module',
    scripts: {
      ...pkg.scripts,
      dev:
        pkg.scripts?.dev || 'echo "Plug your preferred framework dev server here (e.g. vite dev)"',
      typecheck: 'tsc --noEmit',
      'build:css': 'tailwindcss -i ./src/styles/index.css -o ./dist/styles.css --minify',
      build: 'npm run typecheck && npm run build:css',
      lint: 'eslint "src/**/*.{ts,tsx}" --max-warnings=0',
      format: 'prettier --write "src/**/*.{ts,tsx,css,md}"',
    },
    dependencies: {
      ...(pkg.dependencies || {}),
      react: pkg.dependencies?.react || '^18.3.1',
      'react-dom': pkg.dependencies?.['react-dom'] || '^18.3.1',
      '@mindfiredigital/ignix-ui': pkg.dependencies?.['@mindfiredigital/ignix-ui'] || '^1.0.5',
      clsx: pkg.dependencies?.clsx || '^2.1.1',
      'tailwind-merge': pkg.dependencies?.['tailwind-merge'] || '^3.0.2',
    },
    devDependencies: {
      ...(pkg.devDependencies || {}),
      typescript: '^5.6.2',
      '@types/react': '^18.3.5',
      '@types/react-dom': '^18.3.0',
      tailwindcss: '^3.4.14',
      postcss: '^8.4.41',
      autoprefixer: '^10.4.20',
      eslint: '^9.11.1',
      '@typescript-eslint/parser': '^8.7.0',
      '@typescript-eslint/eslint-plugin': '^8.7.0',
      prettier: '^3.3.3',
      'prettier-plugin-tailwindcss': '^0.6.6',
    },
  };

  await fs.writeJSON(pkgPath, starterPkg, { spaces: 2 });
}
// Create tsconfig.json
export async function createUniversalTsconfig(root: string): Promise<void> {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['DOM', 'DOM.Iterable', 'ES2020'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      jsx: 'react-jsx',
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
      },
    },
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeJSON(path.join(root, 'tsconfig.json'), tsconfig, { spaces: 2 });
}
// Create tailwind.config.js
export async function createUniversalTailwindConfig(root: string): Promise<void> {
  const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/pages/**/*.{ts,tsx,js,jsx}',
    './node_modules/@mindfiredigital/ignix-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [],
};
`;

  await fs.writeFile(path.join(root, 'tailwind.config.js'), config);
}
// Create postcss.config.js
export async function createUniversalPostCSSConfig(root: string): Promise<void> {
  const contents = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  await fs.writeFile(path.join(root, 'postcss.config.js'), contents);
}
// Create .eslintrc.json
export async function createUniversalEslintConfig(root: string): Promise<void> {
  const eslintConfig = {
    env: {
      browser: true,
      es2022: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    ignorePatterns: ['dist', 'node_modules'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  };

  await fs.writeJSON(path.join(root, '.eslintrc.json'), eslintConfig, { spaces: 2 });
}
// Create ignix.config.js
export async function createUniversalIgnixConfig(root: string): Promise<void> {
  const ignixConfig = `/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
module.exports = {
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',
  componentsDir: 'src/components',
  themesDir: 'src/styles/themes',
};
`;

  await fs.writeFile(path.join(root, 'ignix.config.js'), ignixConfig);
}
// Create src directory structure with example components and pages
export async function createUniversalSrcStructure(root: string): Promise<void> {
  const componentsDir = path.join(root, 'src', 'components');
  const pagesDir = path.join(root, 'src', 'pages');
  const stylesDir = path.join(root, 'src', 'styles');

  await fs.ensureDir(componentsDir);
  await fs.ensureDir(pagesDir);
  await fs.ensureDir(stylesDir);
  await fs.ensureDir(path.join(root, 'dist'));

  const uiShell = `import { Button, Card } from '@mindfiredigital/ignix-ui';

export function UiShell() {
  return (
    <section className="space-y-6 rounded-2xl border border-border bg-background/80 p-8 shadow-sm backdrop-blur">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Ignix UI</p>
        <h1 className="text-3xl font-semibold">Framework-agnostic starter</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Compose Tailwind primitives, strict TypeScript types, and Ignix UI components in any React
          runtime: Next.js, Remix, Vite, Expo Router for web, or custom design systems.
        </p>
      </header>
      <Card className="space-y-4 p-6">
        <div>
          <h2 className="text-lg font-medium">Drop-in ready</h2>
          <p className="text-sm text-muted-foreground">
            Add your preferred router and renderer, wire the exported pages, and keep this starter as
            a shared UI workspace.
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto">
          Start shipping
        </Button>
      </Card>
    </section>
  );
}
`;
  await fs.writeFile(path.join(componentsDir, 'UiShell.tsx'), uiShell);

  const pageContent = `import { UiShell } from '../components/UiShell';

export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted px-4 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-foreground">
        <UiShell />
        <section className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Plug me anywhere</p>
          <ul className="list-inside list-disc space-y-2 pt-2">
            <li>Next.js / Remix / Expo Router: import the components into your route files</li>
            <li>Vite / Rspack / Webpack: mount \`HomePage\` in your entry point</li>
            <li>Design systems: re-export \`UiShell\` from a shared package</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
`;
  await fs.writeFile(path.join(pagesDir, 'index.tsx'), pageContent);

  const styles = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

body {
  @apply bg-background text-foreground antialiased;
}
`;
  await fs.writeFile(path.join(stylesDir, 'index.css'), styles);
}
// Create .gitignore
export async function createUniversalGitignore(root: string): Promise<void> {
  const contents = `node_modules
dist
.turbo
.next
.vercel
.cache
.env
.env.*
*.log
*.lock
.DS_Store
`;

  await fs.writeFile(path.join(root, '.gitignore'), contents);
}
// Create README.md
export async function createUniversalReadme(root: string): Promise<void> {
  const readme = `# Ignix UI Universal Starter

A framework-agnostic React + TypeScript + Tailwind starter wired for Ignix UI. Drop these folders into any framework (Next.js, Remix, Gatsby, Vite, Expo Router for web) or keep them in a standalone UI workspace.

## What's inside

- ✅ Strict TypeScript configuration with sensible aliases
- ✅ Tailwind CSS v3+ with design tokens that mirror Ignix UI defaults
- ✅ Ready-to-import Ignix UI component examples (\`UiShell\`, \`HomePage\`)
- ✅ Opinionated folder structure:
  - \`src/components\` for reusable UI
  - \`src/pages\` for route-level views
  - \`src/styles\` for global and theme styles
- ✅ Build hints for CSS + type-check pipelines

## Scripts

- \`npm run dev\` – attach your framework runner (defaults to a placeholder echo)
- \`npm run typecheck\` – zero-emission strict TypeScript check
- \`npm run build:css\` – compiles Tailwind to \`dist/styles.css\`
- \`npm run build\` – runs both to keep CI happy
- \`npm run lint\` / \`npm run format\` – optional quality gates

## Hook it into your framework

1. Copy \`src/components\`, \`src/pages\`, and \`src/styles\` into your app (or keep this repo dedicated to UI).
2. Ensure your bundler resolves \`@/*\` to \`src/*\` (Next.js, Remix, Vite already do).
3. Import \`HomePage\` from \`src/pages/index.tsx\` wherever your framework expects a view component.
4. Keep Tailwind running:

   \`\`\`bash
   npm install
   npm run build:css # or tailwindcss -w for watch mode
   \`\`\`

## Ignix CLI integration

- Add more components: \`npx ignix add <component-name>\`
- Browse starters: \`npx ignix starters\`
- Manage themes: \`npx ignix themes list\`

## Next steps

1. Initialize git: \`git init && git add . && git commit -m "init ignix universal starter"\`
2. Wire the exported components into your chosen framework.
3. Deploy with the tooling you already use (Vercel, Netlify, Render, Docker, etc.).

Happy shipping! 🚀
`;

  await fs.writeFile(path.join(root, 'README.md'), readme);
}

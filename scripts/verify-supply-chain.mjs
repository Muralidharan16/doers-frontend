import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const packages = lock.packages ?? {};
const parse = (value) => {
  const match = String(value ?? '').match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) throw new Error(`Invalid semver: ${value}`);
  return match.slice(1).map(Number);
};
const gte = (value, floor) => {
  const actual = parse(value), minimum = parse(floor);
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] > minimum[i]) return true;
    if (actual[i] < minimum[i]) return false;
  }
  return true;
};
const versionAt = (path) => {
  const value = packages[path]?.version;
  if (!value) throw new Error(`Missing lock entry: ${path}`);
  return value;
};
const equal = (actual, expected, label) => {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
};
const atLeast = (actual, floor, label) => {
  if (!gte(actual, floor)) throw new Error(`${label}: expected >=${floor}, got ${actual}`);
};
equal(pkg.dependencies.axios, '1.19.0', 'manifest axios');
equal(pkg.dependencies['react-router-dom'], '7.18.2', 'manifest react-router-dom');
equal(pkg.devDependencies.vite, '7.3.6', 'manifest vite');
if (!/^\^5\./.test(pkg.devDependencies['@vitejs/plugin-react'])) throw new Error('manifest plugin-react must remain compatible 5.x');
equal(pkg.devDependencies.postcss, '^8.5.18', 'manifest postcss');
equal(pkg.devDependencies.vitest, '4.1.9', 'manifest vitest');
if (pkg.dependencies?.esbuild || pkg.devDependencies?.esbuild) throw new Error('top-level manifest esbuild must remain absent');
equal(versionAt('node_modules/axios'), '1.19.0', 'lock axios');
atLeast(versionAt('node_modules/form-data'), '4.0.6', 'lock form-data');
atLeast(versionAt('node_modules/react-router-dom'), '7.18.2', 'lock react-router-dom');
atLeast(versionAt('node_modules/react-router'), '7.18.2', 'lock react-router');
equal(versionAt('node_modules/vite'), '7.3.6', 'lock vite');
if (parse(versionAt('node_modules/@vitejs/plugin-react'))[0] !== 5) throw new Error('lock plugin-react must remain 5.x');
atLeast(versionAt('node_modules/postcss'), '8.5.18', 'lock postcss');
atLeast(versionAt('node_modules/brace-expansion'), '5.0.8', 'lock brace-expansion');
atLeast(versionAt('node_modules/esbuild'), '0.28.1', 'lock esbuild');
atLeast(versionAt('node_modules/@babel/core'), '7.29.6', 'lock @babel/core');
atLeast(versionAt('node_modules/undici'), '7.29.0', 'lock undici');
equal(versionAt('node_modules/vitest'), '4.1.9', 'lock vitest');
console.log('Supply-chain version contract verified.');

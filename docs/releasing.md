# Releasing @dev-dga/angular

This document outlines the strategy for releasing the Angular library.

## Local Development
During development, the library and showcase live in the same workspace.
The showcase uses `tsconfig.json` path mappings to resolve `@dev-dga/angular` to the live source code, enabling hot-reload.

## Building the Library
To produce a distributable package:
```bash
npm run build dga-angular
```
This uses `ng-packagr` to compile the library into `dist/dga-angular/` containing `fesm2022`, types, and SCSS assets.

## Versioning
Update the version in:
- `projects/dga-angular/package.json`
- `CHANGELOG.md`

## Publishing
To publish to a registry (NPM or private internal registry):
```bash
cd dist/dga-angular
npm publish
```
*Do NOT publish from the root workspace directory.*

## GitHub Release
1. Create a Git tag (e.g., `v1.0.0`).
2. Push the tag to GitHub.
3. Create a GitHub Release pointing to the tag, including the relevant section from `CHANGELOG.md`.

## Consuming a Released Version
Consumers should run:
```bash
npm install @dev-dga/angular@latest
```
And follow the Setup instructions to import the global styles and standalone components.

# Changelog

## [v2.3.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v2.3.0...v2.3.1)
### Fixed
* fix: Vite 6 made the CSS output file breaking [\#470](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/470)

### Changed
* Updated development dependencies
* chore(deps): Bump vite-plugin-dts to 4.5.0

## [v2.3.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v2.2.2...v2.3.0)
### Added
* Support for Vite 6
  * Dropped support for Vite 4 as the vue plugin is no longer compatible with v4 and v6.

### Fixed
* fix(REUSELicensesPlugin): remove duplicates in license files [\#293](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/293) \([ShGKme](https://github.com/ShGKme)\)

### Changed
* ci: Update dependabot-approve-merge.yml [\#315](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/315) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* Updated development dependencies
* chore(deps): Bump elliptic to 6.6.0
* chore(deps): Bump magic-string to 0.30.17
* chore(deps): Bump nanoid to 3.3.8
* chore(deps): Bump rollup-plugin-corejs to 1.0.1
* chore(deps): Bump rollup-plugin-esbuild-minify to 1.2.0
* chore(deps): Bump rollup-plugin-license to 3.5.3
* chore(deps): Bump rollup-plugin-node-externals to 8.0.0
* chore(deps): Bump vite-plugin-css-injected-by-js to 3.5.2
* chore(deps): Bump vite-plugin-dts to 4.4.0
* chore(deps): Bump @rollup/plugin-replace to 6.0.2
* chore(deps): Bump @vitejs/plugin-vue to 5.2.1

## [v2.2.2](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.2.2)
### Fixed
* fix(REUSELicensesPlugin): Emit files in `generateBundle` hook to have real filenames [\#283](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/283) \([susnux](https://github.com/susnux)\)

## [v2.2.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.2.1)
### Fixed
* fix: Adjust import of `rollup-plugin-esbuild-minify` [\#279](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/279) \([susnux](https://github.com/susnux)\)

## [v2.2.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.2.0)
### Added
* feat(EmptyJSDirPlugin): Allow to specify other directories to clear [\#240](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/240) \([susnux](https://github.com/susnux)\)
* feat: Add REUSE license plugin to extract license information for built assets [\#250](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/250) \([susnux](https://github.com/susnux)\)

### Fixed
* perf(CSSEntryPointsPlugin): Only visit chunks once per entry point [\#239](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/239) \([susnux](https://github.com/susnux)\)
* fix(appconfig): `cssCodeSplit` is enabled by default so handle CSS entries [\#243](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/243) \([susnux](https://github.com/susnux)\)
* fix: Revert chunkFileNames to include hash [\#267](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/267) \([juliushaertl](https://github.com/juliushaertl)\)

### Changed
* Migrate REUSE to TOML format [\#245](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/245) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* chore: Update workflows from templates [\#213](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/213) \([susnux](https://github.com/susnux)\)
* chore(deps): Bump rollup-plugin-license to 3.5.2
* chore(deps): Bump @vitejs/plugin-vue to 5.1.2
* chore(deps): Bump magic-string to 0.30.11

## [v2.1.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.1.0)
### Added
* feat(app-config): Add option to override the app name [\#205](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/205) \([susnux](https://github.com/susnux)\)
* Allow to specify an output prefix and load app id from appinfo [\#207](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/207) \([susnux](https://github.com/susnux)\)
* feat: Add `CSSEntryPointsPlugin` to fix vite for creating one CSS entry per JS entry point [\#204](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/204) \([susnux](https://github.com/susnux)\)

### Changed
* chore(deps-dev): Bump vite from 5.2.13 to 5.3.1
* chore(deps): Bump braces from 3.0.2 to 3.0.3

## [v2.0.2](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.0.2)
### Fixed
* fix: explicitly use window.OC global in app config [\#197](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/197) \([st3iny](https://github.com/st3iny)\)

## [v2.0.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.0.1)
### Changed
* chore: update source url in dep5 spec [\#187](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/187) \([st3iny](https://github.com/st3iny)\)
* chore(deps): Bump vite-plugin-node-polyfills from 0.21.0 to 0.22.0
* chore(deps): Bump @vitejs/plugin-vue from 5.0.4 to 5.0.5
* chore(deps): Bump @rollup/plugin-replace from 5.0.5 to 5.0.7

## [v2.0.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v2.0.0)
### Breaking changes
This version is Vue 3 only.
For Vue 2 use the 1.x version.

## [v1.2.3](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.2.3)
### :bug: Fixed bugs
* fix(tests): `ssrBuild` was renamed to `isSsrBuild` [\#168](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/168) \([susnux](https://github.com/susnux)\)
* fix(base): Correctly pass minify configuration to vite [\#169](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/169) \([susnux](https://github.com/susnux)\)

### Changed
* chore(deps): Bump vite-plugin-node-polyfills to 0.21.0
* chore(deps): Bump rollup-plugin-license to 3.3.1
* chore(deps): Bump rollup-plugin-node-externals to 7.1.1
* chore(deps): Bump magic-string to 0.30.10
* chore(deps): Bump vite-plugin-dts to 3.8.3
* chore(deps): Bump vite-plugin-css-injected-by-js to 3.5.0
* chore(deps): Update `rollup-plugin-corejs` to v1

## [v1.2.2](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.2.2) (2024-02-06)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.2.1...v1.2.2)

### :bug: Fixed bugs
* fix: Move fonts to `css/fonts` and fix css path resolving [\#121](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/121) \([susnux](https://github.com/susnux)\)

### Changes
* chore(deps): Bump magic-string from 0.30.5 to 0.30.6
* chore(deps): Bump rollup-plugin-node-externals from 6.1.2 to 7.0.1

## [v1.2.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.2.1) (2024-01-29)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.2.0...v1.2.1)

### :bug: Fixed bugs
* fix(css-plugin): Use `generateBundle` hook to prevent CSS imports from being lost [\#112](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/112) \([susnux](https://github.com/susnux)\)

### Changes
* Updated development dependencies
* Updated dependencies:
  * chore(deps): Bump vite-plugin-node-polyfills from 0.17.0 to 0.18.0 [\#89](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/89) \([dependabot](https://github.com/dependabot)\)
  * chore(deps): Bump vite-plugin-css-injected-by-js from 3.3.0 to 3.3.1 [\#92](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/92) \([dependabot](https://github.com/dependabot)\)
  * chore(deps): Bump vite-plugin-node-polyfills from 0.18.0 to 0.19.0 [\#94](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/94) \([dependabot](https://github.com/dependabot)\)
  * chore(deps): Bump vite-plugin-dts from 3.6.4 to 3.7.0 [\#96](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/96) \([dependabot](https://github.com/dependabot)\)
  * chore(deps): Bump vite-plugin-dts from 3.7.0 to 3.7.1 [\#111](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/111) \([dependabot](https://github.com/dependabot)\)
  * chore(deps): Bump browserslist-to-esbuild from 1.2.0 to 2.1.1 [\#105](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/105) \([dependabot](https://github.com/dependabot)\)
* chore: update workflows from templates [\#93](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/93) \([nextcloud-command](https://github.com/nextcloud-command)\)

## [v1.2.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.2.0) (2023-12-19)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.1.1...v1.2.0)

### :rocket: Enhancements
* enh: Support vite v5 [\#69](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/87) \([susnux](https://github.com/susnux)\)

### Changed
* Updated dependencies

## [v1.1.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.1.1) (2023-12-19)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.1.0...v1.1.1)

### :bug: Fixed bugs
* fix(typing): fix typo in typing by [\#69](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/69) \([ShGKme](https://github.com/ShGKme)\)
* fix: typo in readme by [\#83](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/83) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix: Do not set vue's `comments` setting for dev builds by [\#84](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/84) \([susnux](https://github.com/susnux)\)

### Changed
* Updated dependencies

## [v1.1.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.1.0) (2023-10-20)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.0.1...v1.1.0)

### :rocket: Enhancements
* feat: add option to customize asset file names [\#41](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/41) ([ShGKme](https://github.com/ShGKme))
* feat\(appconfig\): Add base path so module preloading works [\#43](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/43) ([susnux](https://github.com/susnux))

### :bug: Fixed bugs
* fix\(appconfig\): Fix the default value for inlining CSS [\#42](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/42) ([susnux](https://github.com/susnux))

### Closed pull requests
* chore(deps): Bump postcss from 8.4.24 to 8.4.31 [\#37](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/37)
* chore(deps-dev): Bump @types/node from 20.8.1 to 20.8.3 [\#38](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/38)
* chore(deps): Bump rollup-plugin-node-externals from 6.1.1 to 6.1.2 [\#39](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/39)
* chore(deps): Bump @rollup/plugin-replace from 5.0.2 to 5.0.3 [\#40](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/40)
* chore(deps): Bump rollup-plugin-esbuild-minify from 1.1.0 to 1.1.1 [\#44](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/44)
* chore(deps-dev): Bump @types/node from 20.8.3 to 20.8.6 [\#47](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/47)
* chore(deps): Bump magic-string from 0.30.4 to 0.30.5 [\#46](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/46)
* chore(deps-dev): Bump typedoc from 0.25.1 to 0.25.2 [\#45](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/45)
* chore(deps-dev): Bump @babel/traverse from 7.23.0 to 7.23.2 [\#48](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/48)

## [v1.0.1](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.0.1) (2023-10-06)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.0.0...v1.0.1)

### :bug: Fixed bugs
- fix: Remove define of process.env from base config [\#34](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/34) ([susnux](https://github.com/susnux))
- fix(libConfig): import default in CJS build [\#35](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/35) ([ShGKme](https://github.com/ShGKme))

## [v1.0.0](https://github.com/nextcloud-libraries/nextcloud-vite-config/tree/v1.0.0) (2023-10-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vite-config/compare/v1.0.0-beta.1...v1.0.0)

### :rocket: Enhancements
- Allow to create vite config for Nextcloud apps
- Allow to create vite config for libraries targetting the Nextcloud ecosystem

### :bug: Fixed bugs

- fix\(app\): Build in app mode and not in lib mode while building Nextcloud apps [\#31](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/31) ([susnux](https://github.com/susnux))
- fix\(lib\): Make libconfig work when minification and css split is enabled [\#29](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/29) ([susnux](https://github.com/susnux))
- fix\(lib\): Include hash in assets name [\#16](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/16) ([susnux](https://github.com/susnux))
- fix\(libconfig\): Strip off `node:` prefix on core modules for webpack compatibility [\#10](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/10) ([susnux](https://github.com/susnux))
- fix: Make license information for 3rd party modules deterministic [\#12](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/12) ([susnux](https://github.com/susnux))
- fix\(app\): Polyfill node core modules by default when building apps [\#11](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/11) ([susnux](https://github.com/susnux))

### Closed pull requests

- chore: Prepare new bugfix release [\#17](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/17) ([susnux](https://github.com/susnux))
- Allow to properly include CSS in library builds by importing the CSS files [\#13](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/13) ([susnux](https://github.com/susnux))
- chore: Prepare first release with new package name \(nextcloud namespace\) [\#9](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/9) ([susnux](https://github.com/susnux))
- docs: Add link for the documentation to the README [\#8](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/8) ([susnux](https://github.com/susnux))
- feat: Add typedoc documentation for public API and interfaces [\#4](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/4) ([susnux](https://github.com/susnux))
- chore: Add some basic CI workflows [\#3](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/3) ([susnux](https://github.com/susnux))
- chore: Rename package to `@nextcloud/vite-config` [\#2](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/2) ([susnux](https://github.com/susnux))
- chore\(ci\): Add test workflow and scripts [\#30](https://github.com/nextcloud-libraries/nextcloud-vite-config/pull/30) ([susnux](https://github.com/susnux))

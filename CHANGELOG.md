# Changelog

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

## How to use
If your app uses an entry point for the main app and one for the settings page, then your default project tree will look like this:
```
css/
js/
lib/
src/
  |- ...
  |- main.js
  |- settings.js
package.json
vite.config.js
```

And your `vite.config.js` should look like this:
```js
import { createAppConfig } from '@nextcloud/vite-config'

export default createAppConfig({
    // entry points: {name: script}
    main: 'src/main.js',
    settings: 'src/settings.js',
})
```

You can also modify the configuration, for example if you want to set an include path for the scss preprocessor:

```js
import { createAppConfig } from '@nextcloud/vite-config'
import { mergeConfig } from 'vite'
import path from 'node:path'

const yourOverrides = defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [
                    path.resolve(__dirname, './src/assets'),
                ],
            },
        },
    }
})

export default createAppConfig({
    // entry points
    main: 'src/main.js',
    settings: 'src/settings.js',
}, {
    // options
    config: yourOverrides
})
```

### Use with a library
There is also a configuration for libraries, this configuration will handle the output directory correctly and automatically mark all `dependencies` as external:

```js
import { createLibConfig } from '@nextcloud/vite-config'

const translations = //...

export default createLibConfig({
    index: 'src/index.js',
}, {
    replace: {
        TRANSLATIONS: translations,
    },
})
```

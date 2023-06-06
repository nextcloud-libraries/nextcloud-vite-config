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
import { nextcloudViteConfig } from '@nextcloud/vite-config'

export default nextcloudViteConfig({
    main: 'src/main.js',
    settings: 'src/settings.js',
})
```

Of cause you can modify the configuration, for example if you want to set an include path for the scss preprocessor:

```js
import { nextcloudViteConfig } from '@nextcloud/vite-config'
import { mergeConfig } from 'vite'
import path from 'node:path'

const config = nextcloudViteConfig({
    main: 'src/main.js',
    settings: 'src/settings.js',
})

export default mergeConfig(config, {
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [
                    path.resolve(__dirname, './src/assets'),
                ],
            },
        },
    },
})
```
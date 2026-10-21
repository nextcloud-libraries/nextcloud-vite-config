/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import type { Plugin, PluginOption } from 'vite'

import { createAppConfig } from '@nextcloud/vite-config'
import { expect, test } from 'vitest'

/**
 * The options the Vue plugin of a resolved config was given.
 *
 * @param isCustomElement - What to tell the template compiler, if anything
 */
async function vueOptions(isCustomElement?: (tag: string) => boolean) {
	const config = await createAppConfig({ main: 'src/main.js' }, { isCustomElement })({ command: 'build', mode: 'production' })
	const plugins = (config.plugins ?? []).flat(Infinity as 1) as (PluginOption | Plugin)[]
	const vue = plugins.find((plugin) => (plugin as Plugin)?.name === 'vite:vue') as Plugin & { api: { options: { template?: { compilerOptions?: { isCustomElement?: (tag: string) => boolean } } } } }
	return vue.api.options
}

test('the Vue template compiler is told which tags are custom elements', async () => {
	const isCustomElement = (tag: string) => tag === 'nc-viewer-file'
	const options = await vueOptions(isCustomElement)

	expect(options.template?.compilerOptions?.isCustomElement).toBe(isCustomElement)
})

test('the Vue template compiler is left alone without', async () => {
	const options = await vueOptions()

	expect(options.template?.compilerOptions?.isCustomElement).toBeUndefined()
})

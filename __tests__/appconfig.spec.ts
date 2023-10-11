/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// ok as this is just for tests
// eslint-disable-next-line n/no-extraneous-import
import type { RollupOutput, OutputOptions, OutputChunk } from 'rollup'
import { build, resolveConfig } from 'vite'
import { describe, it, expect } from 'vitest'
import { createAppConfig } from '../lib/appConfig'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { LibraryOptions } from '../lib/libConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('app config', () => {
	it('replaces process.env', async () => {
		const root = resolve(__dirname, '../__fixtures__/app_process_env')

		const resolved = await createAppConfig({
			main: resolve(root, 'main.js'),
		})({ command: 'build', mode: 'production' })

		const result = await build({
			...resolved,
			root,
		})
		const { output } = result as RollupOutput
		const code = (output[0] as OutputChunk).code
		expect(code.includes('process.env')).toBe(false)
		expect(code).toMatchSnapshot()
	})

	it('moves CSS assets to css/', async () => {
		const resolved = await createConfig('build', 'development')

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ name: 'some.css' })).toBe('css/@nextcloud-vite-config-[name].css')
		expect(assetFileNames({ name: 'other/file.css' })).toBe('css/@nextcloud-vite-config-[name].css')
	})

	it('moves image assets to img/', async () => {
		const resolved = await createConfig('build', 'development')

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ name: 'some.png' })).toBe('img/[name][extname]')
		expect(assetFileNames({ name: 'some.svg' })).toBe('img/[name][extname]')
		expect(assetFileNames({ name: 'some.jpg' })).toBe('img/[name][extname]')
		expect(assetFileNames({ name: 'some.ico' })).toBe('img/[name][extname]')
	})

	it('allow custom asset names', async () => {
		const resolved = await createConfig('build', 'development', { assetFileNames: (({ name }) => name === 'main.css' ? 'css/app-styles.css' : undefined) as never })

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ name: 'main.css' })).toBe('css/app-styles.css')
		expect(assetFileNames({ name: 'foo.css' })).toBe('css/@nextcloud-vite-config-[name].css')
	})

	const createConfig = async (command: 'build' | 'serve' = 'build', mode: 'development' | 'production' = 'production', options?: LibraryOptions) => await resolveConfig(await createAppConfig({
		main: 'src/main.js',
	}, options)({ command, mode, ssrBuild: false }), command)
})

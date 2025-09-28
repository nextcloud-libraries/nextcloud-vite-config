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
import { AppOptions, createAppConfig } from '../lib/appConfig'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('app config', () => {
	it('adds global appName variable', async () => {
		const resolved = await createConfig('build', 'development')
		expect([resolved.build.rollupOptions.output!].flat()[0].intro).toMatch(/appName = "@nextcloud\/vite-config"/)
	})

	it('adds global appName variable with override', async () => {
		const resolved = await createConfig('build', 'development', { appName: 'spreed' })
		expect([resolved.build.rollupOptions.output!].flat()[0].intro).toMatch(/appName = "spreed"/)
	})

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
		expect(assetFileNames({ names: ['some.css'] })).toMatch(/^css\/[^/]+\.css/)
		expect(assetFileNames({ names: ['other/file.css'] })).toMatch(/^css\/[^/]+\.css/)
	})

	it('moves image assets to img/', async () => {
		const resolved = await createConfig('build', 'development')

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ names: ['some.png'] })).toBe('img/[name][extname]')
		expect(assetFileNames({ names: ['some.svg'] })).toBe('img/[name][extname]')
		expect(assetFileNames({ names: ['some.jpg'] })).toBe('img/[name][extname]')
		expect(assetFileNames({ names: ['some.ico'] })).toBe('img/[name][extname]')
	})

	it('moves fonts to css/fonts', async () => {
		const resolved = await createConfig('build', 'development')

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ names: ['some.woff'] })).toBe('css/fonts/[name][extname]')
		expect(assetFileNames({ names: ['some.woff2'] })).toBe('css/fonts/[name][extname]')
		expect(assetFileNames({ names: ['some.otf'] })).toBe('css/fonts/[name][extname]')
		expect(assetFileNames({ names: ['some.ttf'] })).toBe('css/fonts/[name][extname]')
	})

	it('allow custom asset names', async () => {
		const resolved = await createConfig('build', 'development', { assetFileNames: ({ names }) => names[0] === 'main.png' ? 'img/main.png' : undefined })

		const output = resolved.build.rollupOptions.output as OutputOptions
		expect(typeof output?.assetFileNames).toBe('function')
		const assetFileNames = output?.assetFileNames as ((chunkInfo: unknown) => string)
		expect(assetFileNames({ names: ['main.png'] })).toBe('img/main.png')
		expect(assetFileNames({ names: ['foo.png'] })).toBe('img/[name][extname]')
	})

	it('extracts CSS by default with CSS entry points', async () => {
		const resolved = await createConfig('build', 'development')

		expect(resolved.build.cssCodeSplit).toBe(true)
		expect(resolved.plugins.find(({ name }) => name === 'css-entry-points-plugin')).not.toBeUndefined()
	})

	it('does not add CSS entry points with CSS inject', async () => {
		const resolved = await createConfig('build', 'development', { inlineCSS: true })

		expect(resolved.build.cssCodeSplit).toBe(true)
		// not found!
		expect(resolved.plugins.find(({ name }) => name === 'css-entry-points-plugin')).toBeUndefined()
	})

	describe('inlining css', () => {
		const pluginName = [cssInjectedByJsPlugin()].flat()[0].name

		it('does not inline css by default', async () => {
			const resolved = await createConfig()
			expect(resolved.plugins.filter(({ name }) => name === pluginName)).toHaveLength(0)
		})

		it('does not inline css when disabled', async () => {
			const resolved = await createConfig('build', 'production', { inlineCSS: false })
			expect(resolved.plugins.filter(({ name }) => name === pluginName)).toHaveLength(0)
		})

		it('does inline css when enabled', async () => {
			const resolved = await createConfig('build', 'production', { inlineCSS: true })
			expect(resolved.plugins.filter(({ name }) => name === pluginName)).toHaveLength(1)
		})

		it('does inline css when enabled with configuration', async () => {
			const resolved = await createConfig('build', 'production', { inlineCSS: { useStrictCSP: true } })
			expect(resolved.plugins.filter(({ name }) => name === pluginName)).toHaveLength(1)
		})
	})

	const createConfig = async (command: 'build' | 'serve' = 'build', mode: 'development' | 'production' = 'production', options?: AppOptions) => await resolveConfig(await createAppConfig({
		main: 'src/main.js',
	}, options)({ command, mode, isSsrBuild: false }), command)
})

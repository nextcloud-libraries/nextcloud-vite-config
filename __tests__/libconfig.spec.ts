/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ESBuildOptions, resolveConfig, Rollup } from 'vite'
import { describe, it, expect } from 'vitest'
import { LibraryOptions, createLibConfig } from '../lib/libConfig'

describe('library config', () => {
	describe('workaround vite#14515 minify bug', () => {
		it('minifies using esbuild by default', async () => {
			const resolved = await createConfig('build', 'production', { minify: true })

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// but minify enabled
			expect(resolved.build.minify).toBe('esbuild')
			expect(typeof resolved.esbuild).toBe('object')
			expect((resolved.esbuild as ESBuildOptions).minifyIdentifiers).toBe(true)
			expect((resolved.esbuild as ESBuildOptions).minifySyntax).toBe(true)
			// but no whitespace minify
			expect((resolved.esbuild as ESBuildOptions).minifyWhitespace).toBe(false)
		})

		it('minifies using esbuild on development when configured', async () => {
			const resolved = await createConfig('build', 'development', { minify: true })

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// but minify enabled
			expect(resolved.build.minify).toBe('esbuild')
			expect(typeof resolved.esbuild).toBe('object')
			expect((resolved.esbuild as ESBuildOptions).minifyIdentifiers).toBe(true)
			expect((resolved.esbuild as ESBuildOptions).minifySyntax).toBe(true)
			// but no whitespace minify
			expect((resolved.esbuild as ESBuildOptions).minifyWhitespace).toBe(false)
		})

		it('does not minify on development by default', async () => {
			const resolved = await createConfig('build', 'development')

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// and minify disabled
			expect(resolved.build.minify).toBe(false)
		})

		it('keep name without inlining the CSS assets ', async () => {
			const resolved = await createConfig('build', 'development')

			const [output] = resolved.build.rollupOptions.output! as Rollup.OutputOptions[]
			expect(output.assetFileNames).not.toBe(undefined)
			expect(output.assetFileNames({ names: ['some.css'] })).toBe('[name].css')
			expect(output.assetFileNames({ names: ['some.nfo'] })).toBe('assets/[name][extname]')
		})

		it('move CSS files to asset directory when inlining CSS', async () => {
			const resolved = await createConfig('build', 'development', { inlineCSS: true })

			const [output] = resolved.build.rollupOptions.output! as Rollup.OutputOptions[]
			expect(output.assetFileNames).not.toBe(undefined)
			expect(output.assetFileNames({ names: ['some.css'] })).toBe('assets/[name][extname]')
			expect(output.assetFileNames({ names: ['some.nfo'] })).toBe('assets/[name][extname]')
		})

		it('allow custom asset names', async () => {
			const resolved = await createConfig('build', 'development', {
				assetFileNames: ((assetInfo: Rollup.PreRenderedAsset) => assetInfo.names.includes('foo.css') ? 'bar.css' : undefined) as never,
			})

			const [output] = resolved.build.rollupOptions.output! as Rollup.OutputOptions[]
			expect(output.assetFileNames).not.toBe(undefined)
			expect(output.assetFileNames({ names: ['foo.css'] })).toBe('bar.css')
			expect(output.assetFileNames({ names: ['baz.css'] })).toBe('[name].css')
		})
	})

	const createConfig = async (
		command: 'build' | 'serve' = 'build',
		mode: 'development' | 'production' = 'production',
		options?: LibraryOptions,
	) => {
		return await resolveConfig(
			await createLibConfig(
				{
					main: 'src/main.js',
				},
				options,
			)({ command, mode, isSsrBuild: false }), command)
	}
})

/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ESBuildOptions, resolveConfig } from 'vite'
import { describe, it, expect } from 'vitest'
import { LibraryOptions, createLibConfig } from '../lib/libConfig'

describe('library config', () => {
	describe('workaround vite#14515 minify bug', () => {
		it('minifies using esbuild by default', async () => {
			const resolved = await createConfig('build')

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

			expect(resolved.build.rollupOptions.output?.[0].assetFileNames).not.toBe(undefined)
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'some.css' })).toBe('[name].css')
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'some.nfo' })).toBe('assets/[name]-[hash][extname]')
		})

		it('move CSS files to asset directory when inlining CSS', async () => {
			const resolved = await createConfig('build', 'development', { inlineCSS: true })

			expect(resolved.build.rollupOptions.output?.[0].assetFileNames).not.toBe(undefined)
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'some.css' })).toBe('assets/[name]-[hash][extname]')
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'some.nfo' })).toBe('assets/[name]-[hash][extname]')
		})

		it('allow custom asset names', async () => {
			const resolved = await createConfig('build', 'development', { assetFileNames: (({ name }) => name === 'foo.css' ? 'bar.css' : undefined) as never })

			expect(resolved.build.rollupOptions.output?.[0].assetFileNames).not.toBe(undefined)
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'foo.css' })).toBe('bar.css')
			expect(resolved.build.rollupOptions.output?.[0].assetFileNames({ name: 'baz.css' })).toBe('[name].css')
		})
	})

	const createConfig = async (command: 'build' | 'serve' = 'build', mode: 'development' | 'production' = 'production', options?: LibraryOptions) => {
		const inlineConfig = await createLibConfig({
			main: 'src/main.js',
		}, options)({ command, mode })
		return await resolveConfig({ ...inlineConfig, configFile: false }, command)
	}
})

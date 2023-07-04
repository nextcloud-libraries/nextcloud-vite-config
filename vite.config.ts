/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createLibConfig } from './lib/libConfig'

export default createLibConfig({
	index: 'lib/index.ts',
}, {
	// No need for polyfills this is Node only
	coreJS: false,
	// There is no css, speed up build
	inlineCSS: false,
	config: {
		// This is bad, but we must disable the `define` option to not replace that in our replace config ;-)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		define: false,
	},
})

/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig({
	index: 'src/index.js',
	sub: 'src/sub/index.js',
}, {
	DtsPluginOptions: false,
	libraryFormats: ['es', 'cjs'],
	preserveModules: true,
})

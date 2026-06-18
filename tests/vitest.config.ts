/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: 'E2E tests',
					setupFiles: 'setup.ts',
					browser: {
						provider: playwright(),
						enabled: true,
						// at least one instance is required
						instances: [
							{ browser: 'chromium', headless: true, exclude: ['**/node_modules/**', '**/.git/**', '**.node.spec.ts'] },
						],
					},
				},
			},

			// node tests
			{
				test: {
					name: 'Node',
					include: ['**/*.node.spec.ts'],
				},
			},
		],
	},
})

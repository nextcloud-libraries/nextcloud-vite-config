/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { beforeEach } from 'vitest'

beforeEach(() => {
	const main = window.document.createElement('main')
	main.id = 'content'
	window.document.body.append(main)
})

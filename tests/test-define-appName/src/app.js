/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { getName } from 'sub'

const el = document.createElement('div')
el.innerText = `App: ${appName} ${appVersion}`
document.querySelector('main').append(el)

getName()

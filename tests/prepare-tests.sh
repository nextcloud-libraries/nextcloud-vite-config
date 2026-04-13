#!/bin/sh
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: CC0-1.0

ALL_TESTS=$(ls -1 | grep -P "^test-")
VUE2_TEST=$(ls -1 | grep -P "test-.*vue2")

# "Update" the linked package to make sure new content is copied
npm update "@nextcloud/vite-config"
for f in $ALL_TESTS; do
	# would like to use comm here but bash does not like <() syntax
	echo $VUE2_TEST | grep $f 2>&1 >/dev/null
	if [ $? -eq 0 ]; then
		continue
	fi
	cd "$f"
	npm run build
	cd -
done

# non-workspaces
for f in $VUE2_TEST; do
	cd "$f"
	npm ci
	npm update "@nextcloud/vite-config"
	npm run build
	cd -
done

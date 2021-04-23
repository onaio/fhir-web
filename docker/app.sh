#!/bin/sh
# vim:sw=4:ts=4:et

set -e

confd -onetime -backend env
sed -i "s/CONFIG_VERSION/`date '+%s'`/" /usr/src/web/index.html
sed -i "s/Redirected path should match configured path/Redirected path ' +  Url.parse(options.redirectUri).pathname + 'should match configured path/" /usr/src/web/node_modules/client-oauth2/src/client-oauth2.js
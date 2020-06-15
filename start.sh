#!/bin/sh

export SIGNALS_SITE_TITLE=$(cat /environment.conf.json | jq -r '.language.siteTitle')
export SIGNALS_CONFIG=$(cat /environment.conf.json | jq -c)

envsubst < /usr/share/nginx/html/index.html > /tmp/index.html

mv /tmp/index.html /usr/share/nginx/html/index.html

nginx -g "daemon off;"

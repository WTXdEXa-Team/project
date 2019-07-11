#!/usr/bin/env bash

link() {
    echo Linking $2
    mkdir -p $(dirname "$2")
    ln -sf "$(realpath $1)" "$2"
}

mkdir -p lib

WEB3_PAGE=https://github.com/ethereum/web3.js/blob/v1.0.0-beta.33/dist/web3.js
# From the $WEB3_PAGE we can copy the $WEB3 link from the Download button
WEB3=https://github.com/ethereum/web3.js/raw/v1.0.0-beta.33/dist/web3.js
WEB3_ETAG=03e45b94f403b67885e4c04f4bcd791127e2ce73

echo "Downloading $WEB3 if necessary..."
curl -H "If-None-Match: \"$WEB3_ETAG\"" -Lo lib/web3.js.maybe $WEB3
# If the file was not modified the output will by empty
if [ -s lib/web3.js.maybe ]; then
    mv lib/web3.js{.maybe,}
else
    rm lib/web3.js.maybe
fi

echo "Linking node_modules..."
link {node_modules,lib}/vue/dist/vue.js
link {node_modules,lib}/vuex/dist/vuex.js
link {node_modules,lib}/vue-router/dist/vue-router.js
link {node_modules,lib}/element-ui/lib/index.js
link {node_modules,lib}/element-ui/lib/theme-chalk/index.css
link {node_modules,lib}/element-ui/lib/theme-chalk/fonts/element-icons.woff
link {node_modules,lib}/element-ui/lib/theme-chalk/fonts/element-icons.ttf
link {node_modules,lib}/ethjs/dist/ethjs.min.js
link {node_modules,lib}/ramda/dist/ramda.min.js
link {node_modules,lib}/@reactivex/rxjs/dist/global/Rx.js
link {node_modules,lib}/chain-dsl/es6.js
link {node_modules,lib}/bignumber.js/bignumber.mjs
link {node_modules,lib}/echarts/dist/echarts.js
link {node_modules,lib}/superstruct/lib/index.es.js
# This link is necessary because the `mjs` extension is not served with
# `application/javascript` mime type, but with `application/octet-stream`
# and it was not straightforward to extend mime-types in browser-sync.conf
ln -sf bignumber.mjs lib/bignumber.js/bignumber.js

# Convert symlinks into location-independent relative form
symlinks -cr lib/

#!/usr/bin/env bash

in="$@"
out=./out/out.json
err=./out/err.json
sum=./out/out.b2
new=./out/contracts.json
colors=$(dirname "$0")/.solc-colors
now=$(date +%H:%M:%S)

cd $(dirname "$0")/..
test -d ./out || mkdir -p ./out
test -f $out -o -f $err && rm -f $out $err

echo -e "Monitoring Solidity sources:\n  " $in
bin/solc-plan.js $in | solc --standard-json --allow-paths . 2>$err  | jq . >$out

echo -ne "\n$now "

if jq -e '.contracts|any' $out > /dev/null; then
    if test -f $sum && b2sum --status --check $sum; then
        echo "Not modified"
        exit 0
    else
        contract_names=$(jq -j '.contracts|keys|join(" ")' $out)
        echo "Successfully compiled:"
        echo "  $contract_names"
        cp $out $new
        b2sum $out > $sum
    fi
else
    echo "Errors:"
fi

jq -r '(.errors//[])[].formattedMessage' $out | grcat $colors > /dev/stderr
test -s $err && (echo; cat $err) > /dev/stderr

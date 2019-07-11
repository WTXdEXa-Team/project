#!/usr/bin/env es

script=$0
R =`{dirname $script}

fn trace functions {
    for (func = $functions)
        let (old = $(fn-$func))
            fn $func args {
                echo calling $func $args
                $old $args
            }
}

DEPLOYER=d124b979f746be85706daa1180227e716eafcc5c
ALICE=a49aad37c34e92236690b93e291ae5f10daf7cbe
BOB=b357fc3dbd4cdb7cbd96aa0a0bd905dbe56cab77
xchg=`{jq -r .address $R/../net/4/xchg.json | sed -e 's/0x//'}

fn addr-sub addr name {
    return 's/(0x)+'$addr'/'$name'/Ig'
}

for (acc = DEPLOYER ALICE BOB)
    acc-subs = $acc-subs <={addr-sub $DEPLOYER DEPLOYER}

echo Address to replace: 0x$DEPLOYER | \
sed -E -e <={%flatten \n $acc-subs}

replacement-rules = '
regexp=(?i)(0x)+'$DEPLOYER'
replace=0xDEPLOYER
count=more
' '
regexp=(?i)(0x)+'$xchg'
replace=4/xchg
count=more
'

coloring-rules = '
# Symbolic Externally Owned Account addresses
regexp=0x(\w+)
color=green,blue
count=more
' '
# Symbolic contract addresses
regexp=[459]/(\w+)
color=green,magenta
count=more
'

rules = <={%flatten \n'-'\n $replacement-rules $coloring-rules}
echo $rules
{
    echo deployer: 0xD124B979F746BE85706DAA1180227E716EAFCC5C
    echo xchg: 0x804295BDCC8C5202D680E4C3E8E111B30FFA31C4
} | \
grcat <{echo $rules}

#!/usr/bin/env bash

prepareEnvironment() {
    which -s jq
    if [[ $? != 0 ]] ; then
        echo "Jq is not installed, please hang on while we install it for you ..."
        brew install jq
    fi
}

cp ../../templates/README.md.template README.md.template
description=$(cat ../../package.json | jq '.description')
echo ${description}

#replaceDescription() {
#    sed -i "" -e "s/@description@/${description}/g" $fullPath/README.md.template
#    touch $fullPath/package.new.json
#    cat package.json | jq --arg desc "${description}" '.description = $desc' > $fullPath/package.new.json
#}

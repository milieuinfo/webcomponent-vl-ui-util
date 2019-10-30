#!/usr/bin/env bash

set -e

#################################################################################################
#                                       Helper functions                                        #
#################################################################################################

CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

installJqDependency() {
    which -s jq
    if [[ $? != 0 ]] ; then
        echo "Jq is not installed, please hang on while we install it for you ..."
        brew install jq
    fi
}

getApiName() {
    IFS='-' # hyphen (-) is set as delimiter
        read -ra array <<< "$1" # str is read into an array as tokens separated by IFS
        for i in "${array[@]}"; do # access each element of array
            output+=${i^} #set first letter to uppercase
        done
    IFS=' '
    echo ${output}
}

getDemoName() {
    vl=$(echo ${1} | cut -c1-2)
    template=$(echo ${1} | cut -c7-)
    echo ${vl}-${template}
}

copyTemplate() { 
    cp ${CWD}/../templates/README.md.template README.md.template
}

#################################################################################################
#                                   Application logic                                           #
#################################################################################################

# Get everything ready
installJqDependency
copyTemplate

# Populate variables
description=$(cat ../../package.json | jq '.description')
componentFullName=$(cat ../../package.json | jq '.name') #vl-ui-template
apiName=$(getApiName ${componentFullName})
demoName=$(getDemoName ${componentFullName})

# Replace all template occurances with correct value
sed -i "" -e "s/@description@/${description}/g" README.md.template
sed -i "" -e "s/@fullName@/${componentFullName}/g" README.md.template
sed -i "" -e "s/@apiName@/${apiName}/g" README.md.template
sed -i "" -e "s/@demoName@/${demoName}/g" README.md.template

# Clean up after ourselves
rm -rf README.md
mv -fv README.md.template ../../../README.new.md

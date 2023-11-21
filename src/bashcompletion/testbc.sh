#!/usr/bin/env bash

function indirect(){
  if [[ -z $ZSH_VERSION ]]; then
    echo ${!1}
  else
    echo ${(P)1}
  fi
}

_test() {
  # declare nestings
  local nestings=(
    "nms=cmd1,cmd2"
  )
  # declare options by location ("_" represents root)
  local opts_by_location=(
    "o_=--globalopt"
    "o_nms=--nmsoption"
    "o_cmd1=--cmd1opt,--cmd1opt2"
    "o_cmd2=--cmd2opt"
  )
  # Calculate keys for all available commands/namespaces
  local all_locations=($(echo "${opts_by_location[@]:1}" | sed 's/o_\([^=]*\)=[^ ]*/\1/g'))
  # initialize top-level definitions
  local top_defs=("${nestings[@]%%=*}")

  for d in "${nestings[@]}";do declare "$d";done
  for o in "${opts_by_location[@]}";do declare "$o";done

  # Obtain the location by removing the cli-name from the list of words
  local location=("${COMP_WORDS[@]:1:$COMP_CWORD-1}")
  # Initialize options with global values
  local opts=($(echo "${o_}" | tr "," "\n"))
  local initialized=false includeopts=false
  while [ ${#location[@]} -gt 0 ]; do
    local curr="${location[@]:0:1}"
    local ocurr="o_$curr"
    # Check for valid command/namespace
    if [[ " ${top_defs[@]} " =~ " ${curr} " ]] && [[ " ${all_locations[@]} " =~ " ${curr} " ]]; then
      top_defs=($(echo "$(indirect $curr)" | tr "," "\n"))
      location=(${location[@]:1})
      opts+=($(echo "$(indirect $ocurr)" | tr "," "\n"))
      initialized=true
      # Check if element is a command to include options
      [[ ! " ${nestings[@]%%=*} " =~ " ${curr} " ]] && includeopts=true || includeopts=false
    else
      # if not valid location was found, empty the list
      [[ $initialized != true ]] && top_defs=()
      break
    fi
  done

  # Include options into top_defs
  [[ $includeopts == true ]] && top_defs+=("${opts[@]}")
  COMPREPLY=($(compgen -W "${top_defs[*]}" -- $2))
}

complete -F _test test
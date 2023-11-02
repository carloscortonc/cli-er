#!/usr/bin/env bash

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

  for d in "${nestings[@]}";do declare -a "$d";done
  for o in "${opts_by_location[@]}";do declare -a "$o";done

  # Obtain the location by removing the cli-name from the list of words
  local location=("${COMP_WORDS[@]:1:$COMP_CWORD-1}")
  # Initialize options with global values
  local opts=(${o_// / })
  local initialized=false includeopts=false
  while [ ${#location[@]} -gt 0 ];
  do
    curr=${location[0]}
    ocurr="o_$curr"
    # Check for valid command/namespace
    if [[ " ${top_defs[@]} " =~ " ${curr} " ]] && [[ " ${all_locations[@]} " =~ " ${curr} " ]]; then
      top_defs=(${!curr//,/ })
      location=(${location[@]:1})
      opts+=(${!ocurr//,/ })
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
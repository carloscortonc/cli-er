#!/usr/bin/env bash

_test() {
  #echo 1=$1 # command
  #echo 2=$2 # uncompleted word
  #echo 3=$3 # previous word
  #echo COMP_WORDS="${COMP_WORDS[@]}"
  #echo COMP_CWORD=$COMP_CWORD
  #echo COMP_LINE=$COMP_LINE

  local all_defs=(
    "nms=cmd1 cmd2"
    "cmd1=--cmd1opt --cmd1opt2"
    "cmd2=--cmd2opt"
  )
  # Calculate all the keys for all_defs
  local all_defs_k=("${all_defs[@]%%=*}")
  # top-level definitions
  local top_defs=('nms')

  for d in "${all_defs[@]}";do declare -a "$d";done


  # Obtain the location by removing the cli-name from the list of words
  local location=("${COMP_WORDS[@]:1:$COMP_CWORD-1}")
  initialized=false

  while [ ${#location[@]} -gt 0 ];
  do
    curr=${location[0]}
    # Check for valid command/namespace
    if [[ " ${top_defs[*]} " =~ " ${curr} " ]] && [[ " ${all_defs_k[*]} " =~ " ${curr} " ]]; then
      top_defs=(${!curr// / })
      location=(${location[@]:1})
      initialized=true
    else
      # if not valid location was found, empty the list
      [[ $initialized != true ]] && top_defs=()
      break
    fi
  done
  COMPREPLY=($(compgen -W "${top_defs[*]}" -- $2))
}

complete -F _test test
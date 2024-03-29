#!/usr/bin/env bash
# Bash completion script for docker
# This file is automatically generated by running `docker generate-completions`.
# Created with cli-er@0.13.0 on 2023-11-25 09:40

function indirect(){
  if [[ -z $ZSH_VERSION ]]; then
    echo ${!1}
  else
    echo ${(P)1}
  fi
}
_docker() {
  # declare nestings
  local nestings=(
    "builder=build,prune"
  )
  # declare options by location ("o_" represents root)
  local opts_by_location=(
    "o_=--debug,--help,--version,--nodebug,--no-debug"
    "o_builder="
    "o_build=--source,--add-host,--build-arg,--cache-from,--disable-content-trust,--file,--iidfile,--isolation,--label,--network,--no-cache,--output,--platform,--progress,--pull,--quiet,--secret,--ssh,--tag,--target"
    "o_prune=--all,--filter,--force,--keep-storage"
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

complete -F _docker docker

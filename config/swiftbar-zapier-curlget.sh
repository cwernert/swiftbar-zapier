#!/usr/bin/env bash
#This file enables background curls to urls provided in params.
#For example, your channel might output a line like this:
#'Trigger Zap|terminal=true param0="https://hooks.zapier.com/endpoint/?foo=bar" bash=~/'
curl $1
#Issue: this does not make use of configdir's __dirname read, so if the user moves the plugin after install this won't work.
#I'll rebuild this properly later

#!/usr/bin/env bash
mkdir -p extracted
for i in $(find -name '*.gz'); do
    gunzip "$i" -c > extracted/"${i%.*}".txt
done
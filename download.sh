#!/bin/bash
while IFS= read -r line
do
    #url="https://util.bitrixsoft.com/example_b24/redirect.php?lang=ru&method=$line"
    #wget -O $line.html "$url"
    data=(${line//,/ })
    wget -O raw_html/${data[0]}.html "${data[1]}"
    sleep 1
done < links.txt

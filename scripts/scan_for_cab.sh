#!/bin/bash

CAB_PORT="12749"
CANDIDATE_FILE=/tmp/cab_candidates

> $CANDIDATE_FILE

sudo arp-scan --localnet --numeric --ignoredups | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" > $CANDIDATE_FILE

while read -r line
do
    nc -v -n -z -w 1 $line $CAB_PORT
    # Get result from netcat
    result=$?
    if [ "$result" -eq "0" ]; then
        echo "Putting cab in in "
        echo $line > ../cab_ip.conf
        exit 0
    fi
    echo "$line is not cab. Continuing search"
done < $CANDIDATE_FILE

echo "Cab not found on network."
exit 1

#!/bin/bash

# Add your microservice ports here
PORTS=(8080 8081 8082 8083 8084 8300)

for P in "${PORTS[@]}"; do
    echo "Killing port $P ..."
    
    PIDS=$(lsof -ti :$P)
    
    if [ -n "$PIDS" ]; then
        kill -9 $PIDS
    else
        echo "No process running on port $P"
    fi
done

echo "All selected ports cleared."
read -p "Press Enter to exit..."

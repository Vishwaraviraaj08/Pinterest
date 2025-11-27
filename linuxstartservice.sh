#!/bin/bash

# ========= CONFIGURATION =========
# Add the folder names of all microservices here

SERVICES=(
  server/business-account-service
  server/collaboration-service
  server/content-service
  server/gateway-service
  server/user-authentication-service
)

# =================================

for S in "${SERVICES[@]}"; do
    echo "------------------------------------"
    echo "Processing $S ..."

    # Check if .env exists
    if [ -f "$S/.env" ]; then
        echo "Updating .env in $S ..."
        echo "DB_PASSWORD=vishwa08" > "$S/.env"
    else
        echo "No .env found in $S"
    fi

    # Start the service after env handling
    echo "Starting $S ..."
    gnome-terminal -- bash -c "cd $S && mvn dependency:sources && mvn spring-boot:run; exec bash"
done

echo
echo "✅ All services processed and started."
echo
read -p "Press Enter to exit..."

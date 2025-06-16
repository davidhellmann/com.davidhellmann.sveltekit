#!/bin/bash

# Atomic Deployment Script für Laravel Forge
# Dieses Script erstellt atomic deployments mit release folders und symlinks

# Konfiguration
DEPLOY_PATH="/home/forge-sveltekit-davidhellmann"
APP_NAME="sveltekit.davidhellmann.com"
RELEASES_PATH="$DEPLOY_PATH/$APP_NAME/releases"
CURRENT_PATH="$DEPLOY_PATH/$APP_NAME/current"
SHARED_PATH="$DEPLOY_PATH/$APP_NAME/shared"
REPO_URL="git@github.com:davidhellmann/sveltekit.git"
BRANCH="main"
MAX_RELEASES=10

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Timestamp für Release
RELEASE_NAME=$(date +%Y%m%d%H%M%S)
RELEASE_PATH="$RELEASES_PATH/$RELEASE_NAME"

echo -e "${GREEN}Starting atomic deployment...${NC}"

# Erstelle Verzeichnisstruktur falls nicht vorhanden
mkdir -p $RELEASES_PATH
mkdir -p $SHARED_PATH

# Clone Repository in neuen Release Ordner
echo -e "${YELLOW}Cloning repository...${NC}"
git clone --depth 1 --branch $BRANCH $REPO_URL $RELEASE_PATH

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to clone repository${NC}"
    exit 1
fi

cd $RELEASE_PATH

# Kopiere .env aus shared Verzeichnis
echo -e "${YELLOW}Setting up environment...${NC}"
if [ -f "$SHARED_PATH/.env" ]; then
    cp $SHARED_PATH/.env $RELEASE_PATH/.env
else
    echo -e "${RED}Warning: .env file not found in shared directory${NC}"
fi

# Installiere NPM Dependencies und baue Assets
echo -e "${YELLOW}Installing NPM dependencies...${NC}"
pnpm install

if [ $? -ne 0 ]; then
    echo -e "${RED}pnpm install failed${NC}"
    rm -rf $RELEASE_PATH
    exit 1
fi

echo -e "${YELLOW}Building site...${NC}"
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}pnpm build failed${NC}"
    rm -rf $RELEASE_PATH
    exit 1
fi

# Aktiviere neues Release durch Symlink Update
echo -e "${YELLOW}Activating new release...${NC}"
ln -nfs $RELEASE_PATH $CURRENT_PATH


# Cleanup alte Releases
echo -e "${YELLOW}Cleaning up old releases...${NC}"
cd $RELEASES_PATH
RELEASES_COUNT=$(ls -1 | wc -l)

if [ $RELEASES_COUNT -gt $MAX_RELEASES ]; then
    RELEASES_TO_DELETE=$((RELEASES_COUNT - MAX_RELEASES))
    ls -1t | tail -n $RELEASES_TO_DELETE | xargs rm -rf
    echo -e "${GREEN}Removed $RELEASES_TO_DELETE old releases${NC}"
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}New release: $RELEASE_NAME${NC}"

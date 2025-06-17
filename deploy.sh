# Konfiguration
DEPLOY_PATH="/home/forge-sveltekit-davidhellmann"
APP_NAME="sveltekit.davidhellmann.com"
RELEASES_PATH="$DEPLOY_PATH/$APP_NAME/releases"
CURRENT_PATH="$DEPLOY_PATH/$APP_NAME/current"
SHARED_PATH="$DEPLOY_PATH/$APP_NAME/shared"
CACHE_PATH="$DEPLOY_PATH/$APP_NAME/cache"
REPO_URL="git@github.com:davidhellmann/com.davidhellmann.sveltekit.git"
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
mkdir -p $CACHE_PATH

# Lösche alten Cache-Inhalt
echo -e "${YELLOW}Cleaning cache directory...${NC}"
if [ -d "$CACHE_PATH" ]; then
    rm -rf $CACHE_PATH
fi
mkdir -p $CACHE_PATH

# Clone Repository in Cache-Ordner
echo -e "${YELLOW}Cloning repository to cache...${NC}"
git clone --depth 1 --branch $BRANCH $REPO_URL $CACHE_PATH

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to clone repository${NC}"
    exit 1
fi

cd $CACHE_PATH

# Kopiere .env aus shared Verzeichnis
echo -e "${YELLOW}Setting up environment...${NC}"
if [ -f "$SHARED_PATH/.env" ]; then
    cp $SHARED_PATH/.env $CACHE_PATH/.env
else
    echo -e "${YELLOW}Warning: .env file not found in shared directory${NC}"
fi

# Installiere Dependencies und baue die App
echo -e "${YELLOW}Installing dependencies with pnpm...${NC}"
pnpm install --frozen-lockfile

if [ $? -ne 0 ]; then
    echo -e "${RED}pnpm install failed${NC}"
    rm -rf $CACHE_PATH
    exit 1
fi

echo -e "${YELLOW}Building SvelteKit application...${NC}"
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}pnpm build failed${NC}"
    rm -rf $CACHE_PATH
    exit 1
fi

# Erstelle Release-Verzeichnis und kopiere nur den build Ordner
echo -e "${YELLOW}Copying build to release directory...${NC}"
mkdir -p $RELEASE_PATH

# Kopiere den build Ordner in den Release-Pfad
if [ -d "$CACHE_PATH/build" ]; then
    cp -r $CACHE_PATH/build/* $RELEASE_PATH/
else
    echo -e "${RED}Build directory not found${NC}"
    rm -rf $CACHE_PATH/*
    rm -rf $RELEASE_PATH
    exit 1
fi

# Setze Berechtigungen
# echo -e "${YELLOW}Setting permissions...${NC}"
# chown -R forge:forge $RELEASE_PATH
# chmod -R 755 $RELEASE_PATH

# Aktiviere neues Release durch Symlink Update
echo -e "${YELLOW}Activating new release...${NC}"
ln -nfs $RELEASE_PATH $CURRENT_PATH

# Lösche Cache-Inhalt
echo -e "${YELLOW}Cleaning up cache...${NC}"
rm -rf $CACHE_PATH

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
echo -e "${GREEN}Active path: $CURRENT_PATH${NC}"

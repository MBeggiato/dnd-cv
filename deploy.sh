#!/bin/bash

# Docker Build und Deploy Script für DND Character Viewer
# Autor: GitHub Copilot
# Datum: 4. September 2025

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguration
IMAGE_NAME="dnd-viewer"
CONTAINER_NAME="dnd-viewer-app"
VERSION=${1:-latest}
PORT=${2:-3000}

echo -e "${BLUE}🎲 DND Character Viewer Docker Deployment${NC}"
echo "==============================================="

# Funktionen
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob Docker läuft
if ! docker info >/dev/null 2>&1; then
    log_error "Docker ist nicht verfügbar oder läuft nicht!"
    exit 1
fi

# Stoppe bestehenden Container falls vorhanden
log_info "Stoppe bestehenden Container..."
if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
    docker stop ${CONTAINER_NAME}
    log_success "Container gestoppt"
else
    log_info "Kein laufender Container gefunden"
fi

# Entferne alten Container
log_info "Entferne alten Container..."
if docker ps -aq -f name=${CONTAINER_NAME} | grep -q .; then
    docker rm ${CONTAINER_NAME}
    log_success "Container entfernt"
fi

# Baue neues Image
log_info "Baue Docker Image..."
docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .
log_success "Image gebaut: ${IMAGE_NAME}:${VERSION}"

# Starte neuen Container
log_info "Starte neuen Container..."
docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p ${PORT}:3000 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    -v "$(pwd)/public:/app/public:ro" \
    ${IMAGE_NAME}:${VERSION}

# Warte auf Container Start
log_info "Warte auf Container Start..."
sleep 5

# Prüfe Container Status
if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
    log_success "Container läuft erfolgreich!"
    echo ""
    echo -e "${GREEN}🎉 Deployment erfolgreich!${NC}"
    echo "📱 Anwendung verfügbar unter: http://localhost:${PORT}"
    echo "🔍 Container Logs: docker logs -f ${CONTAINER_NAME}"
    echo "🛑 Container stoppen: docker stop ${CONTAINER_NAME}"
else
    log_error "Container konnte nicht gestartet werden!"
    echo "📋 Logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

# Zeige Container Info
echo ""
echo "📊 Container Informationen:"
docker ps -f name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

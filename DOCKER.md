# 🎲 D&D Character Viewer - Docker Deployment

Dieses Repository enthält alles, was Sie brauchen, um den D&D Character Viewer in einem Docker-Container zu deployen.

## 🚀 Schnellstart

### Option 1: Automatisches Deployment Script

```bash
# Einfacher Deploy mit Standard-Port 3000
./deploy.sh

# Deploy mit spezifischer Version und Port
./deploy.sh v1.0.0 8080
```

### Option 2: Docker Compose (Empfohlen)

```bash
# Container starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Container stoppen
docker-compose down
```

### Option 3: Manueller Docker Build

```bash
# Image bauen
docker build -t dnd-viewer:latest .

# Container starten
docker run -d \
  --name dnd-viewer-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -v $(pwd)/public:/app/public:ro \
  dnd-viewer:latest
```

## 📁 Charakterdateien

Charakterdateien werden aus dem `public/` Verzeichnis geladen. Sie können neue Charaktere hinzufügen, indem Sie JSON-Dateien in diesen Ordner legen.

### Beispiel-Charakterdatei:

```json
{
  "basic_info": {
    "name": "Mein Charakter",
    "race": "Human",
    "class": "Fighter",
    "level": 5,
    "profile_image": "/character-images/mein-bild.jpg"
  }
  // ... weitere Charakterdaten
}
```

## 🌐 Reverse Proxy Setup (Optional)

Für Production-Deployments mit SSL und Load Balancing:

```bash
# Nginx Reverse Proxy mit Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d
```

### SSL-Zertifikate

Platzieren Sie Ihre SSL-Zertifikate im `ssl/` Verzeichnis:

- `ssl/fullchain.pem`
- `ssl/privkey.pem`

## 🔧 Umgebungsvariablen

| Variable                  | Standard     | Beschreibung                   |
| ------------------------- | ------------ | ------------------------------ |
| `NODE_ENV`                | `production` | Node.js Umgebung               |
| `PORT`                    | `3000`       | Port auf dem die App läuft     |
| `NEXT_TELEMETRY_DISABLED` | `1`          | Deaktiviert Next.js Telemetrie |

## 📊 Monitoring

### Container Status prüfen:

```bash
docker ps -f name=dnd-viewer
```

### Logs anzeigen:

```bash
docker logs -f dnd-viewer-app
```

### Container-Ressourcen überwachen:

```bash
docker stats dnd-viewer-app
```

## 🔒 Sicherheit

Das Setup enthält folgende Sicherheitsmaßnahmen:

- Non-root User im Container
- Read-only Dateisystem für statische Dateien
- Security Headers via Nginx
- Rate Limiting für API-Endpunkte
- Health Checks

## 📚 Verfügbare Charaktere

Der Container kommt mit folgenden Beispiel-Charakteren:

- **Lyralei** - Elf Waldläufer
- **Thorin** - Zwerg Kämpfer
- **Zara** - Tiefling Zauberin
- **Pip** - Halbling Schurke
- **Lyra Brightshield** - Mensch Paladin
- **Xarion Vey** - Dunkelelb Hexenmeister

## 🐛 Troubleshooting

### Container startet nicht:

```bash
# Überprüfe Logs
docker logs dnd-viewer-app

# Überprüfe Port-Konflikte
netstat -tulpn | grep :3000
```

### Charaktere werden nicht geladen:

```bash
# Überprüfe Volume-Mount
docker inspect dnd-viewer-app | grep Mounts -A 10

# Überprüfe Dateiberechtigungen
ls -la public/
```

### Performance-Probleme:

```bash
# Container-Ressourcen erhöhen
docker update --memory=2g --cpus=2 dnd-viewer-app
```

## 🔄 Updates

### Neuen Container deployen:

```bash
# Mit Deploy-Script
./deploy.sh v1.1.0

# Mit Docker Compose
docker-compose pull
docker-compose up -d
```

## 🏗️ Build-Optimierungen

Das Docker-Image ist optimiert für:

- ✅ Multi-stage Build für kleinere Images
- ✅ Node.js Alpine für minimale Basis
- ✅ Next.js standalone output
- ✅ Automatisches output file tracing
- ✅ Caching-freundliche Layer-Struktur

**Finale Image-Größe:** ~150MB

## 🌍 Production-Empfehlungen

1. **Reverse Proxy:** Nutzen Sie Nginx oder Traefik
2. **SSL:** Implementieren Sie HTTPS mit Let's Encrypt
3. **Monitoring:** Nutzen Sie Tools wie Prometheus + Grafana
4. **Backup:** Sichern Sie das `public/` Verzeichnis regelmäßig
5. **Updates:** Implementieren Sie einen CI/CD-Pipeline

## 📞 Support

Bei Problemen:

1. Überprüfen Sie die Container-Logs
2. Prüfen Sie die Docker-Konfiguration
3. Stellen Sie sicher, dass alle Ports verfügbar sind
4. Überprüfen Sie die Dateiberechtigungen

#!/bin/bash

# Erstelle das Verzeichnis zed, falls es nicht existiert
mkdir -p ./.zed

# Schreibe den JSON-Inhalt in die settings.json Datei
cat > ./.zed/settings.json << 'EOF'
{
  "file_scan_exclusions": [
    "**/.git",
    "**/.svn",
    "**/.hg",
    "**/.jj",
    "**/CVS",
    "**/.DS_Store",
    "**/Thumbs.db",
    "**/.classpath",
    "**/.settings"
  ]
}
EOF

echo "Die Datei ./zed/settings.json wurde erfolgreich erstellt."

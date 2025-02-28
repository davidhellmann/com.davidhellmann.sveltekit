#!/bin/bash

# Erstelle das Verzeichnis zed, falls es nicht existiert
mkdir -p ./.zed

# Schreibe den JSON-Inhalt in die settings.json Datei
cat > ./.zed/settings.json << 'EOF'
{
  "file_scan_exclusions": [
    ".git",
    "**/.svn",
    "**/.hg",
    "**/.jj",
    "**/CVS",
    "**/.DS_Store",
    "**/Thumbs.db",
    "**/.classpath",
    "**/.settings",
    ".idea",
    ".vscode",
    ".svelte-kit",
    "build/**/*",
    "node_modules/**/*",
    "pnpm-lock.yaml",
    "sly.json",
    "codegen.ts",
    "eslint.config.js",
    "prettierrc",
    "prettierignore",
    "npmrc",
    ".deployignore",
    ".editorconfig",
    "README.md",
    "static/**/*",
    "scripts/**/*",
    "graphql-request.d.ts",
  ]
}
EOF

echo "Die Datei ./zed/settings.json wurde erfolgreich erstellt."

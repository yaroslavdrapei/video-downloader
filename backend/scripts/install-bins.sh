#!/usr/bin/bash
set -e

BIN_DIR="./binaries"
mkdir -p "$BIN_DIR"

echo "Downloading yt-dlp..."
YTDLP_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
curl -L "$YTDLP_URL" -o "$BIN_DIR/yt-dlp"
chmod +x "$BIN_DIR/yt-dlp"

echo "Downloading ffmpeg..."
FFMPEG_URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
TMP_DIR=$(mktemp -d)
curl -L "$FFMPEG_URL" -o "$TMP_DIR/ffmpeg.tar.xz"
tar -xf "$TMP_DIR/ffmpeg.tar.xz" -C "$TMP_DIR"
FFMPEG_BIN=$(find "$TMP_DIR" -type f -name ffmpeg | head -n1)
cp "$FFMPEG_BIN" "$BIN_DIR/ffmpeg"
chmod +x "$BIN_DIR/ffmpeg"
rm -rf "$TMP_DIR"

echo "All binaries downloaded successfully"

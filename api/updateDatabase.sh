#!/bin/bash

# Save the directory where the script is located
SCRIPT_DIR=$(dirname "$(realpath "$0")")

curl -sSL -o "$SCRIPT_DIR/ALL-phishing-links.tar.gz" https://github.com/mitchellkrogza/Phishing.Database/raw/refs/heads/master/ALL-phishing-links.tar.gz && \
tar -xf "$SCRIPT_DIR/ALL-phishing-links.tar.gz" -C "$SCRIPT_DIR" && \
rm "$SCRIPT_DIR/ALL-feeds-URLS.lst" && \
mv "$SCRIPT_DIR/home/runner/work/Phishing.Database/Phishing.Database/input-source/ALL-feeds-URLS.lst" "$SCRIPT_DIR/ALL-feeds-URLS.lst" && \
rm -r "$SCRIPT_DIR/home" && \
rm "$SCRIPT_DIR/ALL-phishing-links.tar.gz"
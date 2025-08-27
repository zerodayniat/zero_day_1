#!/bin/bash

echo "Starting Voice AI Assistant Server..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if OPENROUTER_API_KEY is set
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "WARNING: OPENROUTER_API_KEY environment variable is not set"
    echo "Please set it using: export OPENROUTER_API_KEY=your-api-key-here"
    echo
    read -p "Enter your OpenRouter API key: " OPENROUTER_API_KEY
    if [ -z "$OPENROUTER_API_KEY" ]; then
        echo "ERROR: API key is required"
        exit 1
    fi
    export OPENROUTER_API_KEY
fi

echo "Starting server on http://localhost:8787"
echo "Press Ctrl+C to stop the server"
echo

node server/server.js
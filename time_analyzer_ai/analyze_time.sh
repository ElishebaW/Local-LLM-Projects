#!/bin/bash

# Define the directory where the file is downloaded
DOWNLOAD_DIR="$HOME/Downloads"

# Get today's date in the format used in the filename (YYYY-MM-DD)
TODAY=$(date +"%Y-%m-%d")

# Construct the expected filename pattern
FILENAME_PATTERN="Toggl_Track_summary_report_${TODAY}_${TODAY}.csv"

# Find the file
FILE_PATH="$DOWNLOAD_DIR/$FILENAME_PATTERN"

# Check if the file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "No Toggl Track summary report found for today ($TODAY) in Downloads."
    exit 1
fi

echo "Processing file: $FILE_PATH"

# Read CSV content
TEXT=$(cat "$FILE_PATH")

# Send extracted text to your local LLM for analysis
echo "$TEXT" | ollama run llama3.2 "Analyze how I spent my time and suggest improvements for tomorrow."

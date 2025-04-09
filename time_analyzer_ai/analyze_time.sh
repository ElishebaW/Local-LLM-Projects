#!/bin/bash

# Define the download folder
DOWNLOAD_DIR="$HOME/Downloads"

# Get today's and yesterday's dates in the format used in the filename
TODAY=$(date +"%Y-%m-%d")
YESTERDAY=$(date -d "yesterday" +"%Y-%m-%d")

# Expected filename bases
FILENAME_BASE_TODAY="Toggl_Track_summary_report_${TODAY}_${TODAY}"
FILENAME_BASE_YESTERDAY="Toggl_Track_summary_report_${YESTERDAY}_${YESTERDAY}"

# Try to find today's and yesterday's files
if [ -f "$DOWNLOAD_DIR/${FILENAME_BASE_TODAY}.csv" ]; then
    FILE_PATH_TODAY="$DOWNLOAD_DIR/${FILENAME_BASE_TODAY}.csv"
    FILE_TYPE_TODAY="csv"
elif [ -f "$DOWNLOAD_DIR/${FILENAME_BASE_TODAY}.pdf" ]; then
    FILE_PATH_TODAY="$DOWNLOAD_DIR/${FILENAME_BASE_TODAY}.pdf"
    FILE_TYPE_TODAY="pdf"
else
    echo "No Toggl Track summary report found for today ($TODAY) in Downloads."
    exit 1
fi

if [ -f "$DOWNLOAD_DIR/${FILENAME_BASE_YESTERDAY}.csv" ]; then
    FILE_PATH_YESTERDAY="$DOWNLOAD_DIR/${FILENAME_BASE_YESTERDAY}.csv"
    FILE_TYPE_YESTERDAY="csv"
elif [ -f "$DOWNLOAD_DIR/${FILENAME_BASE_YESTERDAY}.pdf" ]; then
    FILE_PATH_YESTERDAY="$DOWNLOAD_DIR/${FILENAME_BASE_YESTERDAY}.pdf"
    FILE_TYPE_YESTERDAY="pdf"
else
    echo "No Toggl Track summary report found for yesterday ($YESTERDAY) in Downloads."
    exit 1
fi

echo "Processing files: $FILE_PATH_TODAY and $FILE_PATH_YESTERDAY"

# Extract text based on file type
if [[ "$FILE_TYPE_TODAY" == "pdf" ]]; then
    if ! command -v pdftotext &> /dev/null; then
        echo "Error: pdftotext is not installed. Please install it with 'brew install poppler'"
        exit 1
    fi
    TEXT_TODAY=$(pdftotext "$FILE_PATH_TODAY" -)
elif [[ "$FILE_TYPE_TODAY" == "csv" ]]; then
    TEXT_TODAY=$(cat "$FILE_PATH_TODAY")
else
    echo "Unsupported file type for today's file."
    exit 1
fi

if [[ "$FILE_TYPE_YESTERDAY" == "pdf" ]]; then
    if ! command -v pdftotext &> /dev/null; then
        echo "Error: pdftotext is not installed. Please install it with 'brew install poppler'"
        exit 1
    fi
    TEXT_YESTERDAY=$(pdftotext "$FILE_PATH_YESTERDAY" -)
elif [[ "$FILE_TYPE_YESTERDAY" == "csv" ]]; then
    TEXT_YESTERDAY=$(cat "$FILE_PATH_YESTERDAY")
else
    echo "Unsupported file type for yesterday's file."
    exit 1
fi

# Send the extracted text to the local LLM for analysis and comparison
OUTPUT_FILE="time_analyze.md"
echo "# $TODAY" > "$OUTPUT_FILE"
echo "$TEXT_TODAY" | ollama run llama3.2 "You are my time coach. Compare today's time usage to yesterday's time usage. Provide a score on how much I've improved and explain the reasoning. Suggest specific ways I can improve further. Do not give generic output. Tailor it to me.  Output the analysis in markdown format." >> "$OUTPUT_FILE"

echo "Analysis saved to $OUTPUT_FILE"
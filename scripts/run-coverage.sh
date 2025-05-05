#!/bin/bash

# Run tests with coverage
echo "Running tests with coverage..."
npm run test:coverage

# Open coverage report in browser if available
if [ -f "./coverage/index.html" ]; then
  echo "Opening coverage report in browser..."
  
  # Determine the OS and open the coverage report accordingly
  case "$(uname -s)" in
    Darwin*)    # macOS
      open ./coverage/index.html
      ;;
    Linux*)     # Linux
      if command -v xdg-open > /dev/null; then
        xdg-open ./coverage/index.html
      else
        echo "Please open ./coverage/index.html in your browser to view the report"
      fi
      ;;
    CYGWIN*|MINGW*|MSYS*)  # Windows
      start ./coverage/index.html
      ;;
    *)
      echo "Please open ./coverage/index.html in your browser to view the report"
      ;;
  esac
else
  echo "Coverage report not found. Make sure tests are running correctly."
fi

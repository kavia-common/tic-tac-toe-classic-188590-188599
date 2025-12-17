#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-classic-188590-188599/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


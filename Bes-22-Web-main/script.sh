#!/bin/bash

# Carrega o NVM para garantir a versão correta do Node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

echo "================================================="
echo "Iniciando o projeto Bes-22-Web..."
echo "Acesse o frontend no navegador (geralmente http://localhost:5173)"
echo "Para parar os servidores, pressione Ctrl+C"
echo "================================================="

# Executa o script dev que inicia o frontend e o backend simultaneamente usando concurrently
npm run dev

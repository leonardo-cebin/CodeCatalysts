#!/bin/sh
# entrypoint.sh

# Iniciar o processo padrão
/bin/ollama serve &

# Aguardar o serviço iniciar (ajustar o tempo conforme necessário)
sleep 10

# Executar o comando desejado após o serviço estar rodando
ollama run llama3.2
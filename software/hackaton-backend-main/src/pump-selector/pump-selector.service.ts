import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';

@Injectable()
export class PumpSelectorService {
  private readonly apiUrl = 'http://host.docker.internal:11434/api/generate';

  async *streamResponse(prompt: string): AsyncGenerator<string, void, void> {
    // Requisição para a API
    const response = await axios.post(
      this.apiUrl,
      { model: 'llama3', prompt },
      { responseType: 'stream' }, // Habilita streaming
    );

    // `response.data` é um stream legível do Node.js
    const stream = response.data as Readable;

    let buffer = ''; // Buffer para armazenar chunks incompletos

    for await (const chunk of stream) {
      try {
        // Adiciona o chunk ao buffer
        buffer += chunk.toString();

        // Divide os dados do buffer em mensagens completas usando newline como delimitador (ou outro delimitador)
        let boundary;
        while ((boundary = buffer.indexOf('\n')) >= 0) {
          // Extrai uma mensagem completa do buffer
          const completeChunk = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1); // Remove a mensagem do buffer

          if (completeChunk) {
            console.log('Chunk processado:', completeChunk); // Log do chunk processado

            // Parse o JSON
            const json = JSON.parse(completeChunk);
            if (json.response) {
              yield json.response; // Envia a resposta parcial
            }

            if (json.done) {
              return; // Finaliza se `done: true`
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar chunk:', error);
        continue; // Pule para o próximo chunk se houver erro
      }
    }
  }
}

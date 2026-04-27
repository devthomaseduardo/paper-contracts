import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-1.5-flash';

function getClient(apiKey) {
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export async function refineServiceDescription(apiKey, rawInput) {
  const ai = getClient(apiKey);
  if (!ai) return [rawInput];

  try {
    const prompt = `
      Atue como um Arquiteto de Software Sênior e Gerente de Produtos.

      Tarefa: Transforme a descrição bruta de serviços abaixo em uma lista profissional, técnica e objetiva para um contrato de desenvolvimento de software.

      Regras:
      1. Retorne APENAS um JSON array de strings. Nada mais.
      2. Use linguagem formal, clara e orientada a valor.
      3. Quebre em itens lógicos se necessário.

      Entrada Bruta: "${rawInput.replace(/"/g, '\\"')}"
    `;

    const model = ai.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const text = result.response.text();
    if (!text) return [rawInput];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
      return [text];
    } catch {
      return [text];
    }
  } catch (error) {
    console.error('refineServiceDescription:', error);
    return [rawInput];
  }
}

export async function generateLegalClause(apiKey, request) {
  const ai = getClient(apiKey);
  if (!ai) {
    return 'Erro: GEMINI_API_KEY não configurada no servidor.';
  }

  try {
    const model = ai.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(`
                Atue como um Advogado Especialista em Contratos de Tecnologia.
                Escreva uma cláusula contratual formal, direta e segura para o seguinte pedido: "${request.replace(/"/g, '\\"')}".

                Regras:
                - Use linguagem jurídica adequada (pt-BR).
                - Seja conciso, mas proteja as partes.
                - Não inclua explicações, apenas o texto da cláusula.
                - Comece o texto diretamente.
            `);
    return result.response.text() ?? '';
  } catch (error) {
    console.error('generateLegalClause:', error);
    return 'Erro ao gerar cláusula. Tente novamente.';
  }
}

export async function analyzeDocumentRisks(apiKey, documentContent) {
  const ai = getClient(apiKey);
  if (!ai) return 'IA não configurada.';

  try {
    const prompt = `
      Atue como um Consultor Jurídico e de Riscos para Freelancers de Tecnologia.
      
      Tarefa: Analise o conteúdo do documento abaixo e identifique riscos comuns, cláusulas faltantes ou pontos de atenção para o prestador de serviço (freelancer).
      
      Conteúdo:
      ${JSON.stringify(documentContent)}
      
      Regras:
      1. Retorne APENAS um JSON array de objetos no formato: { "type": "risk" | "tip" | "warning", "message": "string" }.
      2. Seja direto e prático.
      3. Se não houver riscos graves, dê dicas de melhoria.
    `;

    const model = ai.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    return result.response.text() ?? '[]';
  } catch (error) {
    console.error('analyzeDocumentRisks:', error);
    return '[]';
  }
}
export async function generateProjectTimeline(apiKey, services) {
  const ai = getClient(apiKey);
  if (!ai) return '[]';

  try {
    const prompt = `
      Atue como um Gerente de Projetos de Software (Scrum Master/PM).
      
      Tarefa: Com base na lista de serviços abaixo, crie um cronograma técnico de execução para o projeto.
      
      Serviços:
      ${JSON.stringify(services)}
      
      Regras:
      1. Retorne APENAS um JSON array de objetos no formato: { "phase": "Nome da Fase", "duration": "Tempo estimado", "deliverables": "Principais entregáveis" }.
      2. Seja técnico (ex: Setup de Ambiente, Sprint de Frontend, Integração de API, QA & Bug Fixing).
      3. Divida em no máximo 5 ou 6 fases lógicas.
    `;

    const model = ai.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    return result.response.text() ?? '[]';
  } catch (error) {
    console.error('generateProjectTimeline:', error);
    return '[]';
  }
}

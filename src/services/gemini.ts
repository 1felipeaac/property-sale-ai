import { GoogleGenerativeAI  } from "@google/generative-ai";
import { env } from "../env.ts";

const gemini = new GoogleGenerativeAI (env.GEMINI_API_KEY)


const modelName = 'gemini-1.5-flash'
const model = gemini.getGenerativeModel({ model: modelName });
async function pergunteSobreOImovel(pergunta: string, contextoPDF: string): Promise<string> {
    console.log("Construindo o prompt para a IA...");

    // Esta é a parte mais importante: o "template" do prompt.
    // Damos instruções claras para a IA.
    const promptCompleto = `
        Você é um assistente especialista em analisar documentos.
        Sua tarefa é responder a perguntas baseando-se estritamente no texto do documento fornecido.
        Se a resposta não estiver contida no texto, diga "Não consigo te responder essa pergunta".
        Não invente informações.
        Você não deve fornecer os nomes pessoais, números de documentos, matrículas e processos.
        Seja simpático e objetivo.
        Dê respostas curtas, com no máximo 500 caracteres.

        --- CONTEÚDO DO DOCUMENTO ---
        ${contextoPDF}
        --- FIM DO DOCUMENTO ---

        Com base no documento acima, responda à seguinte pergunta:
        Pergunta: "${pergunta}"
    `;

    try {
        console.log("Enviando a pergunta para o modelo Gemini...");
        const result = await model.generateContent(promptCompleto);
        const response = result.response;
        const text = response.text();
        console.log("Resposta recebida.");
        return text;
    } catch (error) {
        console.error("Erro ao se comunicar com a API do Gemini:", error);
        return "Ocorreu um erro ao processar sua pergunta.";
    }
}
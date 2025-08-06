/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { GoogleGenerativeAI  } from "@google/generative-ai";
import { env } from "../env.ts";
import { gerarHash } from "../utils/gerarHash.ts";
import { deleteCacheKey, getCache, setCache } from "../utils/cacheRespostas.ts";

const gemini = new GoogleGenerativeAI (env.GEMINI_API_KEY)

const modelName = 'gemini-1.5-flash'
const model = gemini.getGenerativeModel({ model: modelName });

export async function pergunteSobreOImovel(pergunta: string, contextoPDF: string): Promise<string> {

    const perguntaLimpa = pergunta.trim()
    const cacheKey = gerarHash(perguntaLimpa, contextoPDF)
    const respostaEmCache = getCache(cacheKey);
    if(respostaEmCache){
        console.log("✅ Resposta encontrada na cache")
        return respostaEmCache
    }

    const promptCompleto = `
        Você é um assistente especialista em cartórios, análise de documentos, corretor de imóveis e advogado imobiliário.
        Sua tarefa é responder a perguntas baseando-se no texto do documento fornecido.
        Se a resposta não estiver contida no texto, diga "Não consigo te responder essa pergunta".
        Não invente informações.
        Você não deve fornecer os nomes pessoais, números de documentos, matrículaS, processos e valores.
        Caso perguntem sobre preços ou valores, diga "O valor do imóvel deve ser consultado com o proprietário"
        Seja simpático e objetivo.
        Dê respostas curtas, com no máximo 500 caracteres.

        --- CONTEÚDO DO DOCUMENTO ---
        ${contextoPDF}
        --- FIM DO DOCUMENTO ---

        Com base no documento acima responda à seguinte pergunta:
        Pergunta: "${pergunta}"
    `;

    try {
        console.log("Enviando a pergunta para o modelo Gemini...");
        const result = await model.generateContent(promptCompleto);
        const response = result.response;
        console.log("Resposta recebida.");
        console.log("💾 Salvando resposta no cache.");
        setCache(cacheKey, response.text())

        return response.text()
    } catch (error: any) {
        deleteCacheKey(cacheKey)
        console.log("🗑️ Excluindo resposta no cache.");
        console.error("Erro ao se comunicar com a API do Gemini:", error.message);
        if (error.status === 503) {
            return "O modelo está temporariamente indisponível. Tente novamente em alguns segundos.";
        }
        return "Ocorreu um erro ao tentar processar sua pergunta.";
    }
}
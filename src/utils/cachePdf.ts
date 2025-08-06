/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { baixarPDFdoR2 } from "../services/cloudflare.ts";
import pdf from "pdf-parse"

let contextoPDFCache: string | null = null

export async function inicializarCachePDF():Promise<void>{

    try {
        console.log("Iniciando o aquecimento do cache do PDF...");
        const pdfBuffer = await baixarPDFdoR2();
        const data = await pdf(pdfBuffer);
        contextoPDFCache = data.text;
        console.log("✅ Cache do PDF aquecido com sucesso! A aplicação está pronta.");
    } catch (error) {
        throw new Error(`Não foi possível carregar o documento principal. ${error}`);
    }

}

export function getContextoPDF(): string | null {
    return contextoPDFCache;
}
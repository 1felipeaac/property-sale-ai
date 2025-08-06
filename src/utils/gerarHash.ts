import crypto from "crypto"

export function gerarHash(pergunta: string, contexto: string): string {
    return crypto.createHash("sha256").update(pergunta + contexto).digest("hex")
}
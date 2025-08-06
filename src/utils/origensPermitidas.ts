import { env } from "../env.js"

export function origensPermitidas(origin: string | undefined, listaPermitida: string[]): boolean {
    if(!origin) return true

    return listaPermitida.includes(origin)
}

export const listaPermitida = [
    "http://localhost:5173",
    env.FRONTEND_URL
]
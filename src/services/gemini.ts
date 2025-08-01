import { GoogleGenerativeAI  } from "@google/generative-ai";
import { env } from "../env.ts";

const gemini = new GoogleGenerativeAI (env.GEMINI_API_KEY)


const modelName = 'gemini-1.5-flash'
const model = gemini.getGenerativeModel({ model: modelName });
async function pergunteSobreOImovel(prompt: string){
}
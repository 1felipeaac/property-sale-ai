/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import {fastify, type FastifyReply} from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import {fastifyCors} from '@fastify/cors'
import { env } from "./env.ts";
import pdf from 'pdf-parse';
import { baixarPDFdoR2 } from "./services/cloudflare.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: 'http://localhost:5174/',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {return 'OK'})

app.get('/s3', async (_, res: FastifyReply) =>{
    try {
        const pdfBuffer = await baixarPDFdoR2()

        const data = await pdf(pdfBuffer)

        res.send(data.text)
        
    } catch (error) {
        res.status(500).send(`Erro ao processar PDF - '${error}'`);
    }
})

app.listen({port: env.PORT}).then(() =>{
    console.log('HTTP Server running! 🚀')
})
/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { env } from "./env.ts";
import {fastifyCors} from '@fastify/cors'
import {fastify, type FastifyRequest, type FastifyReply} from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { getContextoPDF, inicializarCachePDF } from "./services/cachePdf.ts";
import { pergunteSobreOImovel } from "./services/gemini.ts";
import z from "zod";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: 'http://localhost:5173',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {return 'OK'})

const perguntaSchema = z.object({
  pergunta: z.string().min(5, {
    message: "A pergunta deve ter pelo menos 5 caracteres.",
  }),
});

app.post('/perguntar', {
    schema: {
        body: perguntaSchema
    }
}, async (req: FastifyRequest<{ Body: z.infer<typeof perguntaSchema> }>, res: FastifyReply) => {
    const { pergunta } = req.body;

    const contexto = getContextoPDF();

    if (!contexto) {
        return res.status(503).send({ error: "Serviço indisponível: o contexto do documento não está carregado." });
    }

    try {
        const resposta = await pergunteSobreOImovel(pergunta, contexto);
        
        return res.send({ resposta });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Ocorreu um erro ao processar sua pergunta." });
    }
})

async function start(){
    try {
        await inicializarCachePDF()
        await app.listen({port: env.PORT})
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()

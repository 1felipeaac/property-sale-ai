/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { env } from "./env.ts";
import { fastifyCors } from '@fastify/cors'
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { inicializarCachePDF } from "./utils/cachePdf.ts";
import { listaPermitida, origensPermitidas } from "./utils/origensPermitidas.ts";
import { httpRoutes } from "./http/routes/httpRoutes.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: (origin, cb) => {
        if (origensPermitidas(origin, listaPermitida)) {
          cb(null, true);
        } else {
          cb(new Error("Origin não permitido"), false);
        }
      },
    methods: ['GET', 'POST', 'PUT'],
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(httpRoutes)

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

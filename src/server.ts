/** biome-ignore-all lint/suspicious/noConsole: <explanation> */


import { fastifyCors } from '@fastify/cors'
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { httpRoutes } from './http/routes/httpRoutes.js';
import { inicializarCachePDF } from './utils/cachePdf.js';
import { origensPermitidas, listaPermitida } from './utils/origensPermitidas.js';
import { env } from './env.js';

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
        await app.listen({port: env.PORT, host: '0.0.0.0'})
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()

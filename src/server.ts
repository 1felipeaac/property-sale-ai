import {fastify} from "fastify";
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

app.get('/s3', async (req, res) =>{
    try {
        const pdfBuffer = await baixarPDFdoR2()

        const data = await pdf(pdfBuffer)

        res.send(data.text)
        
    } catch (error) {
        console.error(error)
    }
})

app.listen({port: env.PORT}).then(() =>{
    console.log(`Port: ${process.env.PORT}`)
    console.log('HTTP Server running! 🚀')
})
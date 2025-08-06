import { FastifyInstance } from "fastify";
import { perguntar } from "./perguntar.ts";
import { getCount, visitCount } from "./visitCount.ts";
export async function httpRoutes(app: FastifyInstance){
    app.post('/perguntar', perguntar)
    app.get('/health', () => {return 'OK'})
    app.get('/visitantes', getCount)
    app.put('/visitantes', visitCount)
}
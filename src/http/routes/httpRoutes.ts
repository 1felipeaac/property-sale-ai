import { FastifyInstance } from "fastify";
import { perguntar } from "./perguntar.js";
import { getCount, visitCount } from "./visitCount.js";
export async function httpRoutes(app: FastifyInstance){
    app.post('/perguntar', perguntar)
    app.get('/health', () => {return 'OK'})
    app.get('/visitantes', getCount)
    app.put('/visitantes', visitCount)
}
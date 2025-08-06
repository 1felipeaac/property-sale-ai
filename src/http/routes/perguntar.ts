import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { getContextoPDF } from "../../utils/cachePdf.ts";
import { pergunteSobreOImovel } from "../../services/gemini.ts";

const perguntaSchema = z.object({
    pergunta: z.string().min(5, {
        message: "A pergunta deve ter pelo menos 5 caracteres.",
    }),
});

export async function perguntar(request: FastifyRequest<{ Body: z.infer<typeof perguntaSchema> }>, reply: FastifyReply){


      const { pergunta } = request.body;

      const contexto = getContextoPDF();
  
      if (!contexto) {
          return reply.status(503).send({ error: "Serviço indisponível: o contexto do documento não está carregado." });
      }
  
      try {
          const resposta = await pergunteSobreOImovel(pergunta, contexto);
          
          return reply.send({ resposta });
  
      } catch (error) {
          console.error(error);
          return reply.status(500).send({ error: "Ocorreu um erro ao processar sua pergunta." });
      }
      
}
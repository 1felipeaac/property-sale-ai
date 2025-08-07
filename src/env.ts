import 'dotenv/config'
import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    GEMINI_API_KEY: z.string(),
    BUCKET_NAME: z.string(),
    PDF_FILE_KEY: z.string(),
    R2_ENDPOINT: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_VALUE_TOKEN: z.string(),
    FRONTEND_URL: z.string() 
})

export const env = envSchema.parse(process.env)
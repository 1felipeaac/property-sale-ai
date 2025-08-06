/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { env } from "../env.ts";
import { GetObjectCommand, S3Client  } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";

function streamToBuffer(stream: Readable): Promise<Buffer>{
    const chunks: Buffer[] = []

    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        stream.on('error', (err) => reject(err))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

export async function baixarPDFdoR2():Promise<Buffer>{
    console.log("Conectando ao Cloudflare R2...")

    const s3 = new S3Client({
        region: "auto",
        endpoint: env.R2_ENDPOINT,
        credentials: {
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY
        }
    })

    console.log(`Baixando o arquivo '${env.PDF_FILE_KEY}' do bucket '${env.BUCKET_NAME}' ...`)

    const command = new GetObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: env.PDF_FILE_KEY
    })

    const response = await s3.send(command)

    if (!response.Body) {
        throw new Error("O corpo do arquivo retornado pelo R2 está vazio.");
    }

    return streamToBuffer(response.Body as Readable);
}
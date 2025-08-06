import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFilePath = path.join(__dirname, '..', '..', 'visitantes.json')

async function readVisitCount(): Promise<number> {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const json = JSON.parse(data);
      return json.count ?? 0;
    } catch (err) {
      return 0;
    }
}

async function writeVisitCount(count: number): Promise<void> {
    const json = JSON.stringify({ count }, null, 2);
    await fs.writeFile(dataFilePath, json, 'utf-8');
}

export async function getCount(){

    const count  = await readVisitCount()

    return {count: count}

}
export async function visitCount(){

    const count  = await readVisitCount()

    const newCount = count + 1

    await writeVisitCount(newCount)

    return {count: newCount}

}
// server/api/config.get.ts

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const filePath = resolve(process.cwd(), 'config', 'fe_config.json')
    try {
        const data = await readFile(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return { error: 'Error loading configuration' }
    }
})

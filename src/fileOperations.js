import { createReadStream } from 'fs';
import { open } from 'fs/promises';
import { FileOperationError } from './errors.js';

export const readFileStream = (path) => {
    try {
        return createReadStream(path, 'utf-8');
    } catch (error) {
        throw new FileOperationError(error);
    }
}

export const newFile = async (path) => {
    let handle = null;
    try {
        handle = await open(path, 'wx');
    } catch (error) {
        throw new FileOperationError(error);
    } finally {
        await handle?.close();
    }
}

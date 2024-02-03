import { createReadStream } from 'fs';
import { open, rename } from 'fs/promises';
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

export const moveFile = async (oldPath, newPath) => {
    try {
        await rename(oldPath, newPath);
    } catch (error) {
        throw new FileOperationError(error);
    }
}

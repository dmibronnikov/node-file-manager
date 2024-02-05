import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { FileOperationError } from './errors.js';

export const compressBrotli = async (sourcePath, destinationPath) => {
    try {
        await pipeline(
            createReadStream(sourcePath),
            createBrotliCompress(),
            createWriteStream(destinationPath)
        );
    } catch (error) {
        throw new FileOperationError(error.message, error);
    }
};

export const decompressBrotli = async (sourcePath, destinationPath) => {
    try {
        await pipeline(
            createReadStream(sourcePath),
            createBrotliDecompress(),
            createWriteStream(destinationPath)
        );
    } catch (error) {
        throw new FileOperationError(error.message, error);
    }
};
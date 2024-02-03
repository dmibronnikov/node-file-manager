import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { FileOperationError } from './errors.js';

export const hash = async (path) => {
    return new Promise((resolve, reject) => {
        try {
            let handle = createReadStream(path);
            let hash = createHash('sha256');

            handle.on('readable', () => {
                const data = handle.read();
                if (data) {
                    hash.update(data);
                } else {
                    resolve(hash.digest('hex'));
                }
            });
        } catch (error) {
            reject(new FileOperationError(error.message, error));
        }
    });
};
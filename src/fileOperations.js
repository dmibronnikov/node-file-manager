import { createReadStream } from 'fs';
import { FileOperationError } from './errors.js';

export const readFileStream = (path) => {
    try {
        return createReadStream(path, 'utf-8');
    } catch (error) {
        throw new FileOperationError(error);
    }
}

export const newFile = (path) => {

}

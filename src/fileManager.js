import { homedir } from 'os';
import { resolve as resolvePath, normalize as normalizePath, join as joinPath, isAbsolute } from 'path';
import { readdir, access } from 'fs/promises';
import { readFileStream } from './FileOperations.js';
import { PathOperationError } from './errors.js';

export class FileManager {
    constructor() {
        this.currentPath = homedir();
    }

    #absolutePath(path) {
        try {
            let normalizedPath = normalizePath(path);
            return isAbsolute(normalizedPath) ? normalizedPath : resolvePath(this.currentPath, normalizedPath);
        } catch (error) {
            throw new PathOperationError(error)
        }
    }

    up() {
        this.currentPath = normalizePath(joinPath(this.currentPath, '..'));
    }

    async changePath(path) {
        let newPath = this.#absolutePath(path);

        try {
            await access(newPath);
            this.currentPath = newPath;
        } catch {
            throw new PathOperationError('Incorrect path');
        }
    }

    async directoryContents() {
        return (await readdir(this.currentPath, { withFileTypes: true })).map((value) => {
            return { name: value.name, type: value.isDirectory() ? 'directory' : 'file' };
        });
    }

    readFileStream(path) {
        let absolutePath = this.#absolutePath(path);
        return readFileStream(absolutePath);
    }
}
import { homedir } from 'os';
import { resolve as resolvePath, normalize as normalizePath, join as joinPath, isAbsolute } from 'path';
import { readdir, access } from 'fs/promises';

export class FileManagerError extends Error { }

export class FileManager {
    constructor() {
        this.currentPath = homedir();
    }

    up() {
        this.currentPath = normalizePath(joinPath(this.currentPath, '..'));
    }

    async changePath(path) {
        let normalizedPath = normalizePath(path);
        let newPath = isAbsolute(normalizedPath) ? normalizedPath : resolvePath(this.currentPath, normalizedPath);

        try {
            await access(newPath);
            this.currentPath = newPath;
        } catch {
            throw new FileManagerError('Incorrect path');
        }
    }

    async directoryContents() {
        return (await readdir(this.currentPath, { withFileTypes: true })).map((value) => {
            return { name: value.name, type: value.isDirectory() ? 'directory' : 'file' };
        });
    }
}
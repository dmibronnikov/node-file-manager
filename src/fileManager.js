import { homedir } from 'os';
import { resolve as resolvePath, normalize as normalizePath, join as joinPath, isAbsolute } from 'path';
import { existsSync } from 'fs';

export class FileManagerError extends Error { }

export class FileManager {
    constructor() {
        this.currentPath = homedir();
    }

    up() {
        this.currentPath = normalizePath(joinPath(this.currentPath, '..'));
    }

    cd(path) {
        let normalizedPath = normalizePath(path);
        let newPath = isAbsolute(normalizedPath) ? normalizedPath : resolvePath(this.currentPath, normalizedPath);

        if (existsSync(newPath)) {
            this.currentPath = newPath;
        } else {
            throw new FileManagerError('Incorrect path');
        }
    }
}
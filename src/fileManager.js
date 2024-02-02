import { homedir } from 'os';
import path from 'path';

export class FileManager {
    constructor() {
        this.currentPath = path.resolve(homedir());
    }

    up() {
        this.currentPath = path.normalize(path.join(this.currentPath, '..'));
    }
}
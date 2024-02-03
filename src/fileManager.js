import { homedir } from 'os';
import { resolve as resolvePath, 
         normalize as normalizePath, 
         join as joinPath, 
         isAbsolute, 
         basename, 
         extname 
        } from 'path';
import { readdir, access } from 'fs/promises';
import { copyFile, moveFile, newFile, readFileStream } from './FileOperations.js';
import { FileOperationError, PathOperationError } from './errors.js';

export class FileManager {
    constructor() {
        this.currentPath = homedir();
    }

    #absolutePath(path) {
        try {
            let normalizedPath = normalizePath(path);
            return isAbsolute(normalizedPath) ? normalizedPath : resolvePath(this.currentPath, normalizedPath);
        } catch (error) {
            throw new PathOperationError(error.message, error)
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

    async createFile(path) {
        let absolutePath = this.#absolutePath(path);
        await newFile(absolutePath);
    }

    async renameFile(path, filename) {
        let oldPath = this.#absolutePath(path);
        let newPath = joinPath(resolvePath(oldPath, '..'), basename(normalizePath(filename)));

        await moveFile(oldPath, newPath);
    }

    async copyFile(pathToFile, pathToDirectory) {
        let absolutePathToFile = this.#absolutePath(pathToFile);
        let absolutePathToDirectory = this.#absolutePath(pathToDirectory);

        if (!!extname(absolutePathToDirectory)) {
            throw new FileOperationError('Provided path is not a directory');
        }

        try {
            let filename = basename(absolutePathToFile);
            await copyFile(absolutePathToFile, joinPath(absolutePathToDirectory, filename));
        } catch (error) {
            throw new FileOperationError(error.message, error);
        }
    }
}
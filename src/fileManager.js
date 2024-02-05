import { homedir } from 'os';
import { resolve as resolvePath, 
         normalize as normalizePath, 
         join as joinPath, 
         isAbsolute, 
         basename, 
         extname 
        } from 'path';
import { readdir, access } from 'fs/promises';
import { copyFile, deleteFile, moveFile, newFile, readFileStream } from './FileOperations.js';
import { FileOperationError, PathOperationError } from './errors.js';
import { hash } from './hashOperations.js';
import { compressBrotli, decompressBrotli } from './compressOperations.js';

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
        const directory = 'directory';
        const file = 'file';

        let directoryContents = (await readdir(this.currentPath, { withFileTypes: true })).map((value) => {
            return { name: value.name, type: value.isDirectory() ? directory : file };
        });
        
        let directories = directoryContents.filter((value) => {
            return value.type === directory;
        }).sort((left, right) => { left.name.localeCompare(right.name); });

        let files = directoryContents.filter((value) => {
            return value.type === file;
        }).sort((left, right) => { left.name.localeCompare(right.name); });

        return [].concat(directories, files);
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

        let filename = basename(absolutePathToFile);
        await copyFile(absolutePathToFile, joinPath(absolutePathToDirectory, filename));
    }

    async deleteFile(path) {
        let absolutePath = this.#absolutePath(path);
        await deleteFile(absolutePath);
    }

    async moveFile(pathToFile, pathToDirectory) {
        await this.copyFile(pathToFile, pathToDirectory);
        await this.deleteFile(pathToFile);
    }

    async calculateFileHash(path) {
        let absolutePath = this.#absolutePath(path);
        return await hash(absolutePath);
    }

    async compressFile(sourcePath, destinationPath) {
        let absoluteSourcePath = this.#absolutePath(sourcePath);
        let absoluteDestinationPath = this.#absolutePath(destinationPath);

        await compressBrotli(absoluteSourcePath, absoluteDestinationPath);
    }

    async decompressFile(sourcePath, destinationPath) {
        let absoluteSourcePath = this.#absolutePath(sourcePath);
        let absoluteDestinationPath = this.#absolutePath(destinationPath);

        await decompressBrotli(absoluteSourcePath, absoluteDestinationPath);
    }
}
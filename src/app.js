import { FileManager } from "./fileManager.js";
import { parseCommand, CommandName } from "./commands.js";
import { pipeline } from 'stream/promises';
import { FileOperationError, OperationError } from "./errors.js";

const close = (username) => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
}

const handleInput = async (chunk) => {
    let chunkString = chunk.toString();
    if (chunkString.includes('.exit')) {
        close(username);
    }

    try {
        let command = parseCommand(chunkString);

        if (command.name.equals(CommandName.up) && command.arguments.length == 0) {
            fileManager.up();
        } else if (command.name.equals(CommandName.cd) && command.arguments.length == 1) {
            await fileManager.changePath(command.arguments[0]);
        } else if (command.name.equals(CommandName.ls) && command.arguments.length == 0) {
            let directoryContents = await fileManager.directoryContents();
            console.table(directoryContents);
        } else if (command.name.equals(CommandName.cat) && command.arguments.length == 1) {
            try {
                let fileStream = fileManager.readFileStream(command.arguments[0]);
                await pipeline(fileStream, process.stdout, { end: false });
                process.stdout.write('\n');
            } catch (error) {
                throw new FileOperationError(error.message, error);
            }
        } else if (command.name.equals(CommandName.add) && command.arguments.length == 1) {
            await fileManager.createFile(command.arguments[0]);
        } else if (command.name.equals(CommandName.rn) && command.arguments.length == 2) {
            await fileManager.renameFile(command.arguments[0], command.arguments[1]);
        } else if (command.name.equals(CommandName.cp) && command.arguments.length == 2) {
            await fileManager.copyFile(command.arguments[0], command.arguments[1]);
        }
        else {
            throw new Error(`[incorrect command] ${command.name.rawValue} ${command.arguments}`);
        }
    } catch(error) {
        if (error instanceof OperationError) {
            console.log(`Operation failed. ${error}`);
        } else {
            console.log(`Invalid input. ${error}`);
        }
    }

    console.log(`You are currently in ${fileManager.currentPath}`);
};

const listenToStdIn = async () => {
    for await (const chunk of process.stdin) {
        await handleInput(chunk);
    }
};

let fileManager = new FileManager();

let username = 'Anonymous';

if (process.argv.length > 2) {
    let usernameArg = process.argv[2].split('=');
    if (usernameArg.length == 2) {
        username = usernameArg[1]
    }
}

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${fileManager.currentPath}`);

process.on('SIGINT', () => {
    close(username);
});

listenToStdIn();
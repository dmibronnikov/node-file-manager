import { FileManager, FileManagerError } from "./fileManager.js";
import { parseCommand, CommandName } from "./commands.js";

const close = (username) => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
}

const handleInput = (chunk) => {
    let chunkString = chunk.toString();
    if (chunkString.includes('.exit')) {
        close(username);
    }

    try {
        let command = parseCommand(chunkString);

        if (command.name.equals(CommandName.up) && command.arguments.length == 0) {
            fileManager.up();
        } else if (command.name.equals(CommandName.cd) && command.arguments.length == 1) {
            fileManager.cd(command.arguments[0]);
        }
        else {
            throw new Error(`[incorrect command] ${command.name.rawValue} ${command.arguments}`);
        }
    } catch(error) {
        if (error instanceof FileManagerError) {
            console.log(`Operation failed. ${error}`);
        } else {
            console.log(`Invalid input. ${error}`);
        }
    }

    console.log(`You are currently in ${fileManager.currentPath}`);
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

process.stdin.on('data', handleInput);

import { FileManager } from "./fileManager.js";
import { parseCommand, Command } from "./commands.js";

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

        if (command.command === Command.up) {
            fileManager.up();
        }
    } catch(error) {
        console.log(`Invalid input ${error}`);
    }

    console.log(`You are currently in ${fileManager.currentPath}`);
};

let fileManager = new FileManager();

let username = 'Anonymous';

if (process.argv.length >= 2) {
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

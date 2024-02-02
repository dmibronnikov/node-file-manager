const close = (username) => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
}

const handleInput = (chunk) => {
    let chunkString = chunk.toString();
    if (chunkString.includes('.exit')) {
        close(username);
    }
    
    console.log(`\n${chunkString}`);
};

let username = 'Anonymous';

if (process.argv.length >= 2) {
    let usernameArg = process.argv[2].split('=');
    if (usernameArg.length == 2) {
        username = usernameArg[1]
    }
}

console.log(`Welcome to the File Manager, ${username}!`);

process.on('SIGINT', () => {
    close(username);
});

process.stdin.on('data', handleInput);

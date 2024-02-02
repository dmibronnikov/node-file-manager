export class Command {
    static up = new Command('up');

    constructor(rawValue) {
        this.rawValue = rawValue;
    }
}

export const parseCommand = (commandString) => {
    let splitted = commandString.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g," ").split(' ');

    if (splitted.length < 1) {
        throw new Error('invalid input');
    }

    switch (splitted[0]) {
        case Command.up.rawValue:
            return {
                command: Command.up,
                arguments: splitted.slice(1)
            };
        default:
            throw new Error('invalid input');
    }
};
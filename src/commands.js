export class CommandName {
    static up = new CommandName('up');
    static ls = new CommandName('cd');

    constructor(rawValue) {
        this.rawValue = rawValue;
    }

    equals(otherCommand) {
        return otherCommand instanceof CommandName && this.rawValue === otherCommand.rawValue;
    }
}

export const parseCommand = (commandString) => {
    let splitted = commandString.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g," ").split(' ');

    if (splitted.length < 1) {
        throw new Error('invalid input');
    }

    return {
        name: new CommandName(splitted[0]),
        arguments: splitted.slice(1)
    };
};
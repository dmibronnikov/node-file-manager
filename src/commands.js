export class CommandName {
    static up = new CommandName('up');
    static cd = new CommandName('cd');
    static ls = new CommandName('ls');
    static cat = new CommandName('cat');
    static add = new CommandName('add');
    static rn = new CommandName('rn');
    static cp = new CommandName('cp');

    constructor(rawValue) {
        this.rawValue = rawValue;
    }

    equals(otherCommand) {
        return otherCommand instanceof CommandName && this.rawValue === otherCommand.rawValue;
    }
}

export const parseCommand = (commandString) => {
    let splitted = commandString.matchAll(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
    let cleaned = []
    for (const value of splitted) {
        if (value[2] !== undefined) {
            cleaned.push(value[2]);
        } else if (value[1] !== undefined) {
            cleaned.push(value[1]);
        } else {
            cleaned.push(value[0]);
        }
    }

    if (cleaned.length < 1) {
        throw new Error('invalid input');
    }

    return {
        name: new CommandName(cleaned[0]),
        arguments: cleaned.slice(1)
    };
};

import os from 'os';
import { OperationError } from './errors.js';

const cpus = () => {
    let coresInfo = os.cpus();
    return {
        coresCount: coresInfo.length,
        info: coresInfo.map((value) => { 
            return {
                model: value.model,
                speed: value.speed / 1000
            }
        })
    }
}

export const systemInfo = (option) => {
    let strippedOption = option.substring(2);

    switch (strippedOption) {
        case 'EOL':
            return { type: strippedOption, data: JSON.stringify(os.EOL) };
        case 'cpus':
            return { type: strippedOption, data: cpus() };
        case 'homedir':
            return { type: strippedOption, data: os.homedir() };
        case 'username':
            return { type: strippedOption, data: os.userInfo().username };
        case 'architecture':
            return { type: strippedOption, data: os.arch() };
        default:
            throw new OperationError(`Incorrect command argument ${option}`);
    }
}
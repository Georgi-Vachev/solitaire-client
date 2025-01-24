import { games } from './dispatcher.js';


const debug = {
    games,
};


export function startInspector() {
    process.stdin.on('data', (data) => {
        const tokens = data.toString().trim().split('.');

        let output = debug;

        for (let token of tokens) {
            if (token.slice(-2) == '()') {
                output = output[token.slice(0,-2)]();
            } else {
                output = output[token];
            }
        }
        console.log(output);
    });
}
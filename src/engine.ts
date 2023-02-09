import { Connection } from "./Connection";

export async function engine(connection: Connection) {
    let state = {};
    connection.on('state', (newState) => { state = newState });

    return state;
}
import { Connection } from "./Connection";


const actionSection = document.getElementById('action');
const boardSection = document.getElementById('board');

export function engine(connection: Connection) {
    const state = {};

    connection.on('state', onState);

    function onState(state) {
        console.log('received state', state);
    }
}
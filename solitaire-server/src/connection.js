import EventEmitter from 'events';
import { WebSocket } from 'ws';


/**
 * 
 * @param {WebSocket} ws 
 * @returns {Promise<Connection>}
 */
export async function connect(ws) {
    return new Promise((resolve, reject) => {
        const deadlineToIdentify = setTimeout(killUninitializedConnection, 10000);

        let name = null;

        ws.on('close', () => {
            if (name != null) {
                console.log('Client left ' + name);
            }
        });

        ws.on('message', onMessage);

        function onMessage(data) {
            const payload = JSON.parse(data.toString());

            if (payload.type == 'identity') {

                ws.off('message', onMessage);

                name = payload.data;

                console.log('Clinet connected ' + name);

                const client = new Connection(ws, name);
                ws.send(JSON.stringify({
                    type: 'identity',
                    data: true
                }));

                clearTimeout(deadlineToIdentify);

                resolve(client);
            }
        }

        function killUninitializedConnection() {
            reject('Client failed to identify within the grace period');
            ws.send(JSON.stringify({ type: 'error', data: 'Client failed to identify within the grace period' }));
            ws.terminate();
        }
    });
}

export class Connection extends EventEmitter {
    /** @type {WebSocket} */
    ws = null;
    /** @type {string} */
    name = null;

    /**
     * @param {WebSocket} ws 
     */
    constructor(ws, name) {
        super();

        this.name = name;
        this.bindSocket(ws);
    }

    /**
     * 
     * @param {WebSocket} ws 
     */
    bindSocket(ws) {
        this.ws = ws;
        this.ws.on('message', data => {
            const payload = JSON.parse(data);
            this.emit(payload.type, payload.data);
        });
    }

    send(type, data) {
        if (this.ws.readyState == this.ws.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        }
    }
}
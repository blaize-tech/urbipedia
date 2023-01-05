import {Urbit} from "@urbit/http-api";
import {AbortController} from "node-abort-controller";
// import {Headers, Request, Response} from 'node-fetch';
import fetch, {Headers, Request, Response} from 'node-fetch';
import axios from "axios";
// import fetch from 'cross-fetch';
// import 'whatwg-fetch'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchWithStreamReader = async (resource, options) => {
    if (options.method === undefined) {
        console.log(resource);
        const stream = await axios.get(resource, {...options, responseType: 'stream'});
        let end = false;
        let haveBuffers = new Array<any>();
        let readers = new Array<any>();
        let lastBody = "";
        const newRes = {
            body: "",
            json: () => {
                if (lastBody.length) {
                    return JSON.parse(String(lastBody));
                }
                return {};
            }
        };
        // @ts-ignore
        stream.data.on("data", async data => {
            console.log('data', String(data), "<<<");
            lastBody = String(lastBody);
            if (haveBuffers.length === 0) {
                haveBuffers.push(Promise.resolve(data));
                return;
            }
            const current = readers[0];
            readers = readers.splice(1);

            current({
                done: end,
                value: data,
            });
        });
        stream.data.on('end', () => {
            end = true;
        });
        Object.assign(newRes, stream);
        // @ts-ignore
        newRes.ok = true;
        // @ts-ignore
        newRes.body = {
            getReader: () => {
                return {
                    read: async () => {
                        if (haveBuffers.length > 0) {
                            const current = haveBuffers[0];
                            haveBuffers = haveBuffers.splice(1);
                            return current;
                        }
                        return new Promise((resolve, reject) => {
                            readers.push(resolve);
                        });
                    },
                }
            }
        };
        return newRes;
    }
    const res = await fetch(resource, options);
    if (!res.response) {
        res.response = {}
    }
    res.json = () => {
        return JSON.parse(res.body);
    };
    return res;
};

if (!('fetch' in globalThis)) {
    Object.assign(globalThis, {fetch: fetchWithStreamReader, Headers, Request, Response})
}

// @ts-ignore
globalThis.window = {fetch: fetchWithStreamReader, Headers, Request, Response};

// @ts-ignore
globalThis.AbortController = AbortController;

export interface UrbitListener {
    onEvent(event: any): void;
}

export interface UrbitClientWrapper {
    send(data: string): void;
}

enum UrbitConnectionState {
    UCS_NOT_CONNECTED = 1,
    UCS_CONNECTED,
    UCS_HAS_ERROR,
    UCS_DISCONECTED,
}

class UrbitClientWrapperImpl implements UrbitClientWrapper {
    listener: UrbitListener | undefined;
    urbit: Urbit | undefined;

    connectionState: UrbitConnectionState | undefined;

    send(data: string): void {
        console.log("received data from ws mock", data);
    }
}

const urbitClientWrapper = new UrbitClientWrapperImpl();

export function connectUrbitClient(listener: UrbitListener): UrbitClientWrapper {
    urbitClientWrapper.listener = listener;
    urbitClientWrapper.connectionState = UrbitConnectionState.UCS_NOT_CONNECTED;

    Urbit.authenticate({
        ship: "timrut-biddeb-timryc-ronsyd--tinlut-talbes-ticpur-binzod",
        url: "localhost:8080",
        code: "rillev-foswyt-ridwed-tiddul",
        verbose: true,
    })
        .then((urbit) => {
            urbitClientWrapper.urbit = urbit;
            urbitClientWrapper.urbit.onOpen = () => {
                urbitClientWrapper.connectionState = UrbitConnectionState.UCS_CONNECTED;
            };
            urbitClientWrapper.urbit.onRetry = () => {
                urbitClientWrapper.connectionState = UrbitConnectionState.UCS_NOT_CONNECTED;
            };
            urbitClientWrapper.urbit.onError = (err) => {
                urbitClientWrapper.connectionState = UrbitConnectionState.UCS_HAS_ERROR;
                console.error('urbit error', err);
            };

            const forceTestConnection = () => {
                try {
                    const path = `/entries/all`;
                    if (urbitClientWrapper.urbit) {
                        const init = () => {
                            urbitClientWrapper.connectionState = UrbitConnectionState.UCS_CONNECTED;

                            if (!urbitClientWrapper
                                || !urbitClientWrapper.urbit
                                || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
                                throw new Error("not connected to urbit");
                            } else {
                                urbitClientWrapper.urbit.subscribe({
                                    app: "zettelkasten",
                                    path: "/updates",
                                    event: (event) => {
                                        listener.onEvent(event);
                                    },
                                    err: () => console.error("Subscription rejected"),
                                    quit: () => console.error("Kicked from subscription"),
                                });
                            }
                        };
                        urbitClientWrapper.urbit
                            .scry({
                                app: "zettelkasten",
                                path: path,
                            })
                            .then(
                                (data) => {
                                    init();
                                },
                                (err) => {
                                    if (err.status === 404) {
                                        init();
                                    } else {
                                        console.error(err);
                                        setTimeout(forceTestConnection, 1000);
                                    }
                                }
                            );
                    } else {
                        setTimeout(forceTestConnection, 1000);
                    }
                } catch (e) {
                    console.error(e);
                    setTimeout(forceTestConnection, 1000);
                }
            };
            forceTestConnection();
        })
        .catch(err => {
            console.error(err);
        });

    return urbitClientWrapper;
}

export async function urbitCreateFile(name: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"create-node": {name: name}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't create file"),
        });
    });
}

export async function urbitUpdateTagsToFile(id: string, tags: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"update-tags": {id: Number.parseInt(id), tags: tags}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't update tags"),
        });
    });
}

export async function urbitUpdateFile(id: string, text: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"update-content": {id: Number.parseInt(id), content: text}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't update file"),
        });
    });
}

export async function urbitRenameFile(id: string, name: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"rename-node": {id: Number.parseInt(id), name: name}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't update name for file"),
        });
    });
}

export async function urbitCreateLinkFileToFile(from: string, to: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"create-link": {link: {from: Number.parseInt(from), to: Number.parseInt(to)}}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't create link to file"),
        });
    });
}

export async function urbitDeleteLinkFileToFile(linkId: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"delete-link": {id: Number.parseInt(linkId)}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't delete link to file"),
        });
    });
}

export async function urbitDeleteFile(id: string) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "zettelkasten",
            mark: "zettelkasten-action",
            json: {"delete-node": {id: Number.parseInt(id)}},
            onSuccess: () => resolve({status: "ok"}),
            onError: () => reject("can't delete file"),
        });
    });
}

export function urbitGetFileEntries(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }

        const path = `/entries/ids/${id}`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve({
                        id: String(id),
                        tags: data.zettel.tags,
                        name: data.zettel.name,
                        content: data.zettel.content,
                    });
                },
                (err) => {
                    reject(err);
                }
            );
    });
}

export function urbitGetNodes(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }

        const path = `/entries/all`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve(data.entries.map((item: any) => String(item)));
                },
                (err) => {
                    if (err.status === 404) {
                        resolve([]);
                    } else {
                        reject(err);
                    }
                }
            ).catch(reject);
    });
}

export function urbitGetLinks(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }

        const path = `/links/all`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve(data.links.map((item: any) => String(item)));
                },
                (err) => {
                    if (err.status === 404) {
                        resolve([]);
                    } else {
                        reject(err);
                    }
                }
            );
    });
}

export function urbitGetLink(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }

        const path = `/links/ids/${id}`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve({
                        id: String(id),
                        from: String(data.link.from),
                        to: String(data.link.to),
                    });
                },
                (err) => {
                    reject(err);
                }
            );
    });
}

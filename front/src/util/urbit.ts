import {OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode} from "../api";
import {Urbit} from "@urbit/http-api";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "localhost:3000";

export interface UrbitListener {
    onEvent(event: any): void;
}

export interface UrbitClientWrapper {
    send(data: string): void;
}

const allNodes = new Array<OrgRoamNode>;
const allLinks = new Array<OrgRoamLink>;
const allTags = new Array<string>;

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

function parseTags(tags: string): Array<string> {
    if (!tags || tags.length === 0) {
        return [];
    }
    return tags.split("#$");
}

async function updateGraphData() {
    const graphdata: OrgRoamGraphReponse = {
        nodes: allNodes,
        links: allLinks,
        tags: allTags,
    };

    const message = {
        type: "graphdata",
        data: graphdata
    };
    const event = {
        data: JSON.stringify(message)
    };
    if (!urbitClientWrapper.listener) {
        throw "urbitClientWrapper not defined";
    }
    urbitClientWrapper.listener.onEvent(event);
}

export function getFileContent(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < allNodes.length; i++) {
            if (allNodes[i].id == id) {
                resolve(String(allNodes[i].content));
            }
        }
    });
}

function createFile(id: string) {
    allNodes.push({
        id: id,
        file: "noname" + String(id),
        title: "noname" + String(id),
        level: 0,
        pos: Number.parseInt(id),
        olp: [],
        properties: {},
        tags: [],
        content: ""
    });
}

function renameFile(id: string, name: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes[i].file = name;
            allNodes[i].title = name;
        }
    }
}

function deleteFile(id: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes.splice(i, 1);
            break;
        }
    }
    for (let i = 0; i < allLinks.length; i++) {
        if (allLinks[i].source == id || allLinks[i].target == id) {
            allLinks.splice(i, 1);
            break;
        }
    }
}

function updateFile(id: string, text: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes[i].content = text;
        }
    }
}

function updateTagsToFile(id: string, tags: Array<string>) {
    let oldTags = new Array<string>;
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            oldTags = allNodes[i].tags;
            allNodes[i].tags = tags;
            break;
        }
    }
    oldTags.map((tag) => {
        let has = false;
        for (let i = 0; i < allNodes.length; i++) {
            const pos = allNodes[i].tags.indexOf(tag);
            if (pos >= 0) {
                has = true;
                break;
            }
        }
        if (!has) {
            const pos = allTags.indexOf(tag);
            if (pos >= 0) {
                allTags.splice(pos, 1)
            }
        }
    });

    tags.map(tag => {
        if (!allTags.includes(tag)) {
            allTags.push(tag);
        }
    });
}

async function handleUpdateUrbit(event: any) {
    console.log('event', JSON.stringify(event, null, 4));
    if (
        "node-created" in event
        || "content-updated" in event
        || "node-renamed" in event
        || "tags-updated" in event
    ) {
        const data = event["node-created"]
            || event["content-updated"]
            || event["node-renamed"]
            || event["tags-updated"];
        if ("node-created" in event) {
            createFile(String(data.id));
        }
        const nodeEntries = await urbitGetFileEntries(String(data.id));
        renameFile(data.id, nodeEntries.name);
        updateFile(data.id, nodeEntries.content);
        updateTagsToFile(data.id, parseTags(nodeEntries.tags));
    } else if ("node-deleted" in event) {
        const data = event["node-deleted"];
        deleteFile(data.id);
    } else if ("link-created" in event) {
        const data = event["link-created"];
        const linkEntries = await urbitGetLink(data.id);
        createLinkFileToFile(linkEntries.id, linkEntries.from, linkEntries.to);
    } else if ("link-deleted" in event) {
        const data = event["link-deleted"];
        deleteLinkFileToFile(data.id);
    } else {
        throw new Error("unsupported");
    }
    updateGraphData().catch(console.error);
}

function createLinkFileToFile(linkId: string, fromId: string, toId: string) {
    allLinks.push({
        id: linkId,
        source: fromId,
        target: toId,
        type: "heading"
    });
}

function deleteLinkFileToFile(linkId: string) {
    for (let i = 0; i < allLinks.length; i++) {
        if (allLinks[i].id == linkId) {
            allLinks.splice(i, 1);
            break;
        }
    }
}

async function watchGraphWithUrbit() {
    if (!urbitClientWrapper
        || !urbitClientWrapper.urbit
        || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
        throw new Error("not connected to urbit");
    }
    try {
        await urbitClientWrapper.urbit.subscribe({
            app: "urbipedia",
            path: "/updates",
            event: handleUpdateUrbit,
            err: () => console.error("Subscription rejected"),
            quit: () => console.error("Kicked from subscription"),
        });
    } catch {
        console.error("Subscription failed");
    }
}

async function getFullGraph() {
    if (!urbitClientWrapper
        || !urbitClientWrapper.urbit
        || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
        throw new Error("not connected to urbit");
    }
    try {
        allLinks.splice(0, allLinks.length);
        allNodes.splice(0, allLinks.length);
        allTags.splice(0, allLinks.length);
        const nodesIds = await urbitGetNodes();
        for (let i = 0; i < nodesIds.length; i++) {
            const id = nodesIds[i];
            createFile(id);
            const nodeEntries = await urbitGetFileEntries(String(id));
            renameFile(id, nodeEntries.name);
            updateFile(id, nodeEntries.content);
            updateTagsToFile(id, parseTags(nodeEntries.tags));
        }
        const linksIds = await urbitGetLinks();
        for (let i = 0; i < linksIds.length; i++) {
            const id = linksIds[i];
            const dataLink = await urbitGetLink(id);
            createLinkFileToFile(id, dataLink.from, dataLink.to);
        }
        updateGraphData().catch(console.error);
    } catch (e) {
        console.error("Sync full graph failed", e);
    }
}

export function connectUrbitClient(listener: UrbitListener): UrbitClientWrapper {
    console.log('ssss');
    urbitClientWrapper.listener = listener;

    const webSocket = new WebSocket(`ws://${BACKEND_URL}/ws`);

    webSocket.onmessage = (packedEvent: MessageEvent<any>) => {
        const event = JSON.parse(packedEvent.data);
        if (!event.ping) {
            urbitClientWrapper.listener?.onEvent(packedEvent);
        }
    };

    webSocket.onopen = (event) => {
        const ping = () => {
            webSocket.send(JSON.stringify({ping: Date.now()}));
            setTimeout(ping, 5 * 60 * 1000);
        };
        ping();
    };


    return urbitClientWrapper;
}

export async function urbitCreateFile(name: string) {
    return axios.post(
        `http://${BACKEND_URL}/create-node`,
        {
            name
        }
    );
}

export async function urbitUpdateTagsToFile(id: string, tags: Array<string>) {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper
            || !urbitClientWrapper.urbit
            || urbitClientWrapper.connectionState !== UrbitConnectionState.UCS_CONNECTED) {
            reject("not connected to urbit");
            throw "error";
        }
        urbitClientWrapper.urbit.poke({
            app: "urbipedia",
            mark: "urbipedia-action",
            json: {"update-tags": {id: Number.parseInt(id), tags: tags.join("#$")}},
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
            app: "urbipedia",
            mark: "urbipedia-action",
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
            app: "urbipedia",
            mark: "urbipedia-action",
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
            app: "urbipedia",
            mark: "urbipedia-action",
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
            app: "urbipedia",
            mark: "urbipedia-action",
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
            app: "urbipedia",
            mark: "urbipedia-action",
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
                app: "urbipedia",
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
                app: "urbipedia",
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
                app: "urbipedia",
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
                app: "urbipedia",
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

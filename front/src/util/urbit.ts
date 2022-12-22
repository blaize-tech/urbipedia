import {OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode} from "../api";
import {Urbit} from "@urbit/http-api";

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

function parseTags(tags: string) : Array<string> {
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
            app: "zettelkasten",
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
        nodesIds.map(async (id) => {
            createFile(id);
            const nodeEntries = await urbitGetFileEntries(String(id));
            renameFile(id, nodeEntries.name);
            updateFile(id, nodeEntries.content);
            updateTagsToFile(id, parseTags(nodeEntries.tags));
        });
        const linksIds = await urbitGetLinks();
        linksIds.map(async (id) => {
            const data = await urbitGetLink(id);
            createLinkFileToFile(id, data["from"], data["to"]);
        });
        updateGraphData().catch(console.error);
    } catch (e) {
        console.error("Sync full graph failed", e);
    }
}

export function connectUrbitClient(listener: UrbitListener): UrbitClientWrapper {
    urbitClientWrapper.listener = listener;
    urbitClientWrapper.connectionState = UrbitConnectionState.UCS_NOT_CONNECTED;

    urbitClientWrapper.urbit = new Urbit("");
    (window as any).urbit = urbitClientWrapper.urbit;

    if (!(window as any)?.ship) {
        throw new Error("window.ship not defined");
    }

    urbitClientWrapper.urbit.ship = (window as any)?.ship;
    urbitClientWrapper.urbit.onOpen = () => {
        console.log("onOpen");
        urbitClientWrapper.connectionState = UrbitConnectionState.UCS_CONNECTED;
        watchGraphWithUrbit().catch(console.error);
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
            console.log("forceTestConnection");
            const path = `/entries/all/`;
            if (urbitClientWrapper.urbit) {
                urbitClientWrapper.urbit
                    .scry({
                        app: "zettelkasten",
                        path: path,
                    })
                    .then(
                        (data) => {
                            console.log("data", data);
                            urbitClientWrapper.connectionState = UrbitConnectionState.UCS_CONNECTED;
                            getFullGraph().catch(console.error);
                        },
                        (err) => {
                            throw new Error(err);
                        }
                    );
            } else {
                throw new Error("not connected to urbit");
            }
        } catch (e) {
            console.error(e);
            setTimeout(forceTestConnection, 1000);
        }
    };
    forceTestConnection();

    setTimeout(() => {
        const message = {
            type: "variables",
            data: {
                varKey1: "444",
                varKey2: "555",
            }
        };
        const event = {
            data: JSON.stringify(message)
        };
        listener.onEvent(event);
    }, 1000);

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

export async function urbitUpdateTagsToFile(id: string, tags: Array<string>) {
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
            json: {"update-tags": {id: id, tags: tags.join("#$")}},
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
            json: {"update-content": {id: id, content: text}},
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
            json: {"rename-node": {id: id, name: name}},
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
            json: {"create-link":{link: {from: from, to: to}}},
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
            json: {"delete-link": {id: linkId}},
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
            json: {"delete-node": {id: id}},
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
                    resolve(data.zettel);
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

        const path = `/entries/all/`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve(data.entries);
                },
                (err) => {
                    reject(err);
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

        const path = `/links/all/`;
        urbitClientWrapper.urbit
            .scry({
                app: "zettelkasten",
                path: path,
            })
            .then(
                (data) => {
                    resolve(data.links);
                },
                (err) => {
                    reject(err);
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
                        id: id,
                        fromId: data["from"],
                        toId: data["to"],
                    });
                },
                (err) => {
                    reject(err);
                }
            );
    });
}

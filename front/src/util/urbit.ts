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

class UrbitClientWrapperImpl implements UrbitClientWrapper {
    listener: UrbitListener | undefined;

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

async function getFullGraph() {
    if (!urbitClientWrapper) {
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
            handleUpdateUrbit(event).catch(console.error);
        }
    };

    webSocket.onopen = (event) => {
        getFullGraph().catch(console.error);
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
    return axios.post(
        `http://${BACKEND_URL}/update-tags`,
        {
            id,
            tags
        }
    );
}


export async function urbitUpdateFile(id: string, text: string) {
    return axios.post(
        `http://${BACKEND_URL}/update-content`,
        {
            id,
            content: text
        }
    );
}

export async function urbitRenameFile(id: string, name: string) {
    return axios.post(
        `http://${BACKEND_URL}/rename-node`,
        {
            id,
            name
        }
    );
}

export async function urbitCreateLinkFileToFile(from: string, to: string) {
    return axios.post(
        `http://${BACKEND_URL}/create-link`,
        {
            from,
            to
        }
    );
}

export async function urbitDeleteLinkFileToFile(linkId: string) {
    return axios.post(
        `http://${BACKEND_URL}/delete-link`,
        {
            linkId,
        }
    );
}

export async function urbitDeleteFile(id: string) {
    return axios.post(
        `http://${BACKEND_URL}/delete-node`,
        {
            id,
        }
    );
}

export function urbitGetFileEntries(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper) {
            reject("not connected to urbit");
            throw "error";
        }
        axios.get(
            `http://${BACKEND_URL}/entries/ids?id=${id}`
        ).then(
            (res) => {
                resolve(res.data);
            },
            (err) => {
                reject(err);
            }
        ).catch(reject);
    });
}

export function urbitGetNodes(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper) {
            reject("not connected to urbit");
            throw "error";
        }
        axios.get(
            `http://${BACKEND_URL}/entries/all`
        ).then(
            (res) => {
                resolve(res.data);
            },
            (err) => {
                reject(err);
            }
        ).catch(reject);
    });
}

export function urbitGetLinks(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper) {
            reject("not connected to urbit");
            throw "error";
        }
        axios.get(
            `http://${BACKEND_URL}/links/all`
        ).then(
            (res) => {
                resolve(res.data);
            },
            (err) => {
                reject(err);
            }
        ).catch(reject);
    });
}

export function urbitGetLink(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!urbitClientWrapper) {
            reject("not connected to urbit");
            throw "error";
        }
        axios.get(
            `http://${BACKEND_URL}/links/ids?id=${id}`
        ).then(
            (res) => {
                resolve(res.data);
            },
            (err) => {
                reject(err);
            }
        ).catch(reject);
    });
}

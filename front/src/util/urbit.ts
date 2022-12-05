import {OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode} from "../api";

export interface UrbitListener {
    onEvent(event: any): void;
}

export interface UrbitClientWrapper {
    send(data: string): void;
}

let nodesCounter = 0;
let linksCounter = 0;
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

export function connectUrbitClient(listener: UrbitListener): UrbitClientWrapper {
    urbitClientWrapper.listener = listener;
    setTimeout(() => {
        const node1: OrgRoamNode = {
            id: "123",
            file: "mock file",
            title: "title mock",
            level: 0,
            pos: 1,
            olp: ["wtf?"],
            properties: {
                "key1": 123,
                "key2": 234,
            },
            tags: ["tag1", "tag2"],
        };
        const node2: OrgRoamNode = {
            id: "99",
            file: "mock file 2",
            title: "title mock 2",
            level: 0,
            pos: 2,
            olp: ["wtf?"],
            properties: {
                "key1": 123,
                "key2": 234,
            },
            tags: ["tag2", "tag3"],
        };
        const node3: OrgRoamNode = {
            id: "77",
            file: "mock file 3",
            title: "title mock 3",
            level: 0,
            pos: 3,
            olp: ["wtf?"],
            properties: {
                "key1": 555,
                "key2": 444,
            },
            tags: ["tag3", "tag4"],
        };
        const link1: OrgRoamLink = {
            source: "123",
            target: "99",
            type: "heading",
        };
        const link2: OrgRoamLink = {
            source: "77",
            target: "99",
            type: "heading",
        };

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
        listener.onEvent(event);
    }, 1000);

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

export async function urbitCreateFile(name: string, text: string) {
    const newId = nodesCounter++;
    allNodes.push({
        id: String(newId),
        file: name,
        title: "unknown" + String(newId),
        level: 0,
        pos: newId,
        olp: [],
        properties: {},
        tags: [],
        content: text
    })
}

export async function urbitAddTagToFile(id: string, tag: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes[i].tags.push(tag);
        }
    }
}

export async function urbitUpdateFile(id: string, text: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes[i].content = text;
        }
    }
}

export async function urbitRenameFile(id: string, name: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes[i].file = name;
        }
    }
}

export async function urbitCreateLinkFileToFile(fromId: string, toId: string, type: number) {
    allLinks.push({
        id: String(linksCounter++),
        source: fromId,
        target: toId,
        type: type === 0 ? "heading" : "parent",
    })
}

export async function urbitDeleteLinkFileToFile(linkId: string) {
    for (let i = 0; i < allLinks.length; i++) {
        if (allLinks[i].id == linkId) {
            allLinks.splice(i, 1);
            break;
        }
    }
}

export async function urbitDeleteFile(id: string) {
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id == id) {
            allNodes.splice(i, 1);
            break;
        }
    }
}

export function urbitGetNodesCountIds(): Promise<number> {
    return new Promise((resolve, reject) => {
        resolve(nodesCounter);
    });
}

export function urbitGetLinksCountIds(): Promise<number> {
    return new Promise((resolve, reject) => {
        resolve(linksCounter);
    });
}

export function urbitGetFilesList(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        const res = Array<string>();
        for (let i = 0; i < allNodes.length; i++) {
            res.push(allNodes[i].file);
        }
        resolve(res);
    });
}

export function urbitGetFileName(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < allNodes.length; i++) {
            if (allNodes[i].id == id) {
                resolve(allNodes[i].file);
            }
        }
        reject("id for node not found");
    });
}

export function urbitGetLinksList(id: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        const res = Array<string>();
        for (let i = 0; i < allLinks.length; i++) {
            res.push(String(allLinks[i].id));
        }
        resolve(res);
    });
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

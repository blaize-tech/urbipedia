import {OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode} from "../api";

export interface WsListener {
    onEvent(event: any): void;
}

export interface MockWS {
    send(data: string): void;
}

const nodes = [];

class MockWsImpl implements MockWS {
    listener: WsListener | undefined;

    send(data: string): void {
        console.log("received data from ws mock", data);
    }
}

const mockWs = new MockWsImpl();

export function mockWS(listener: WsListener): MockWS {
    mockWs.listener = listener;
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
        const nodes: OrgRoamGraphReponse = {
            nodes: [node1, node2, node3],
            links: [link1, link2],
            tags: ["tag1", "tag2"],
        };
        const message = {
            type: "graphdata",
            data: nodes
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
    return mockWs;
}

export function fetchNodeById(id: string): Promise<string> {
    return new Promise(function (resolve, reject) {
        if (Number(id) < 1000) {
            resolve("mock text for node - " + id + " [[mock file]]");
        } else {
            reject("mock error for node - " + id);
        }
    });
}

export function urbitCreateFile(name: string, text: string) {

}

export function urbitAddTagToFile(id: string, tag: string) {

}

export function urbitUpdateFile(id: string, text: string) {

}

export function urbitRenameFile(id: string, name: string) {

}

export function urbitCreateLinkFileToFile(fromId: string, toId: string, type: number) {

}

export function urbitDeleteLinkFileToFile(link_id: string) {

}

export function urbitDeleteFile(id: string) {

}

export function urbitGetCountIds(): string {
    return "0";
}

export function urbitGetFilesList(): Array<string> {
    return Array<string>();
}

export function urbitGetFileName(id: string): string {
    return "test.name";
}

export function urbitGetLinksList(id: string): Array<string> {
    return Array<string>();
}

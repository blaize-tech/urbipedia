import {OrgRoamNode} from '../api'
import {UrbitClientWrapper} from "./urbit";

export function sendMessageToEmacs(command: string, data: {}, urbitClientWrapper: UrbitClientWrapper) {
    urbitClientWrapper.send(JSON.stringify({command: command, data: data}))
}

export function getOrgText(node: OrgRoamNode, urbitClientWrapper: UrbitClientWrapper) {
    sendMessageToEmacs('getText', {id: node.id}, urbitClientWrapper)
}

export function openNodeInEmacs(node: OrgRoamNode, urbitClientWrapper: UrbitClientWrapper) {
    sendMessageToEmacs('open', {id: node.id}, urbitClientWrapper)
}

export function deleteNodeInEmacs(node: OrgRoamNode, urbitClientWrapper: UrbitClientWrapper) {
    if (node.level !== 0) {
        return
    }
    sendMessageToEmacs('delete', {id: node.id, file: node.file}, urbitClientWrapper)
}

export function createNodeInEmacs(node: OrgRoamNode, urbitClientWrapper: UrbitClientWrapper) {
    sendMessageToEmacs('create', {id: node.id, title: node.title, ref: node.properties.ROAM_REFS}, urbitClientWrapper)
}

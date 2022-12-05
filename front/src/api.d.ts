export type OrgRoamGraphReponse = {
  nodes: OrgRoamNode[]
  links: OrgRoamLink[]
  tags: string[]
}

export type OrgRoamNode = {
  id: string
  file: string
  title: string
  level: number
  pos: number
  olp: string[] | null
  properties: {
    [key: string]: string | number
  }
  tags: string[]
  content?: string // todo remove this
}

export type OrgRoamLink = {
  id?: string // todo remove this
  source: string
  target: string
  type: string
}

/-  *zettelkasten
|%
++  enjs-update
  =,  enjs:format
  |=  upd=update
  ^-  json
  |^
  ?+    -.upd  (logged upd)
      %zttls
    (frond 'entries' a+(turn list.upd |=(a=@ (numb a))))
      %logs
    (frond 'logs' a+(turn list.upd logged))
      %lnks
    (frond 'links' a+(turn list.upd |=(a=@ (numb a))))
      %lnk
    (frond 'link' (link lnk.upd))
      %zttl
    (frond 'zettel' (zettel zttl.upd))
      %node-created
    (frond 'node-created' (frond 'id' (numb id.upd)))
      %node-renamed
    (frond 'node-renamed' (frond 'id' (numb id.upd)))
      %content-updated
    (frond 'content-updated' (frond 'id' (numb id.upd)))
      %tags-updated
    (frond 'tags-updated' (frond 'id' (numb id.upd)))
      %link-created
    (frond 'link-created' (frond 'id' (numb id.upd)))
      %node-deleted
    (frond 'node-deleted' (frond 'id' (numb id.upd)))
      %link-deleted
    (frond 'link-deleted' (frond 'id' (numb id.upd)))
  ==
  ++  en-id
    |=  =id
    ^-  json
    (frond 'id' (numb id))
  ++  link
    |=  lnk=^link
    ^-  json
    (pairs ~[['from' (numb from.lnk)] ['to' (numb to.lnk)]])
  ++  zettel
    |=  ztl=^zettel
    ^-  json
    (pairs ~[['name' s+name.ztl] ['content' s+content.ztl] ['tags' s+tags.ztl]])
  ++  elink
    |=  elnk=^elink
    ^-  json
    (pairs ~[['id' (numb id.elnk)] ['link' (link link.elnk)]])
  ++  entry
    |=  ent=^entry
    ^-  json
    (pairs ~[['id' (numb id.ent)] ['zettel' (zettel zettel.ent)]])
  ++  logged
    |=  lgd=^logged
    ^-  json
    ?-    -.lgd
        %create-node
      (frond 'create-node' (frond 'name' s+name.lgd))
        %create-link
      (frond 'create-link' (frond 'link' (link link.lgd)))
        %delete-node
      (frond 'delete-node' (frond 'id' (numb id.lgd)))
        %delete-link
      (frond 'delete-link' (frond 'id' (numb id.lgd)))
        %rename-node
      (frond 'rename-node' (pairs ~[['id' (numb id.lgd)] ['name' s+name.lgd]]))
        %update-content
      (frond 'update-content' (pairs ~[['id' (numb id.lgd)] ['content' s+content.lgd]]))
        %update-tags
      (frond 'update-tags' (pairs ~[['id' (numb id.lgd)] ['tags' s+tags.lgd]]))
    ==
  --
--

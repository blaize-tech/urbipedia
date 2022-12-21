/-  *zettelkasten
|%
++  enjs-update
  =,  enjs:format
  |=  upd=update
  ^-  json
  |^
  ?+    -.q.upd  (logged upd)
      %zttls
    (pairs ~[['time' (numb p.upd)] ['entries' a+(turn list.q.upd en-id)]])
      %logs
    (pairs ~[['time' (numb p.upd)] ['logs' a+(turn list.q.upd logged)]])
      %lnks
    (pairs ~[['time' (numb p.upd)] ['links' a+(turn list.q.upd en-id)]])
      %lnk
    (pairs ~[['time' (numb p.upd)] ['link' (link lnk.q.upd)]])
      %zttl
    (pairs ~[['time' (numb p.upd)] ['zettel' (zettel zttl.q.upd)]])
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
    ?-    -.q.lgd
        %create-node
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'create-node'
          (frond 'name' s+name.q.lgd)
      ==
        %create-link
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'create-link'
          (frond 'link' (link link.q.lgd))
      ==
        %delete-node
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'delete-node'
          (frond 'id' (numb id.q.lgd))
      ==
        %delete-link
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'delete-link'
          (frond 'id' (numb id.q.lgd))
      ==
        %rename-node
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'rename-node'
          (pairs ~[['id' (numb id.q.lgd)] ['name' s+name.q.lgd]])
      ==
        %update-content
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'update-node'
          (pairs ~[['id' (numb id.q.lgd)] ['content' s+content.q.lgd]])
      ==
        %update-tags
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'update-tags'
          (pairs ~[['id' (numb id.q.lgd)] ['tags' s+tags.q.lgd]])
      ==
    ==
  --
--

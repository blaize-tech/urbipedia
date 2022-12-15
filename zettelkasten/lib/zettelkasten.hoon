/-  *zettelkasten
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  ^-  action
  %.  jon
  %-  of
  :~  [%add (ot ~[id+ni txt+so])]
      [%edit (ot ~[id+ni txt+so])]
      [%del (ot ~[id+ni])]
  ==
++  enjs-update
  =,  enjs:format
  |=  upd=update
  ^-  json
  |^
  ?+    -.q.upd  (logged upd)
      %lnks
    (pairs ~[['time' (numb p.upd)] ["links" a+(turn list.q.upd elink)]])
  ::
      %zttl
    (pairs ~[['time' (numb p.upd)] ['entries' a+(turn list.q.upd entry)]])
  ::
      %logs
    (pairs ~[['time' (numb p.upd)] ['logs' a+(turn list.q.upd logged)]])
  ==
  ++  link
    |=  lnk=^link
    ^-  json
    (pairs ~[['from' (numb from.lnk)] ['to' (numb to.lnk)]])
  ++  elink
    |=  ent=^elink
    ^-  json
    (pairs ~[['id' (numb id.ent)] ['link' (link link.ent)]])
  ++  zettel
    |=  ztl=^zettel
    ^-  json
    (pairs ~[['name' s+name.ztl] ['txt' s+txt.ztl] ['tags' s+tags.ztl]])
  ++  entry
    |=  ent=^entry
    ^-  json
    (pairs ~[['id' (numb id.ent)] ['zettel' (zettel zettel.ent)]])
  ++  logged
    |=  lgd=^logged
    ^-  json
    ?-    -.q.lgd
        %add
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'add'
          %-  pairs
          :~  ['id' (numb id.q.lgd)]
              ['txt' s+txt.q.lgd]
      ==  ==
        %edit
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'edit'
          %-  pairs
          :~  ['id' (numb id.q.lgd)]
              ['txt' s+txt.q.lgd]
      ==  ==
        %del
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'del'
          (frond 'id' (numb id.q.lgd))
      ==
    ==
  --
--

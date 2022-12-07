/-  *zettelkasten
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  ^-  action
  %.  jon
  %-  of
  :~  [%add (ot ~[id+ni name+so txt+so])]
      [%edit (ot ~[id+ni name+so txt+so])]
      [%del (ot ~[id+ni])]
  ==
  ^-  action
  %.  jon
  %-  of
  :~  [%add (ot ~[id+ni name+so txt+so])]
      [%edit (ot ~[id+ni name+so txt+so])]
      [%del (ot ~[id+ni])]
  ==
++  enjs-update
  =,  enjs:format
  |=  upd=update
  ^-  json
  |^
  ?+    -.q.upd  (logged upd)
      %zttl
    %-  pairs
    :~  ['time' (numb p.upd)]
        ['entries' a+(turn list.q.upd entry)]
    ==
  ::
      %logs
    %-  pairs
    :~  ['time' (numb p.upd)]
        ['logs' a+(turn list.q.upd logged)]
    ==
  ==
  ++  zettel
    |=  ztl=zettel
    ^-  json
    %-  pairs
    :~
        ['name' s+name.ztl]
        ['txt' s+txt.ztl]
    ==
  ++  entry
    |=  ent=^entry
    ^-  json
    %-  pairs
    :~  ['id' (numb id.ent)]
        ['zettel' o+zettel.ent]
    ==
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
              ['name' s+name.q.lgd]
              ['txt' s+txt.q.lgd]
      ==  ==
        %edit
      %-  pairs
      :~  ['time' (numb p.lgd)]
          :-  'edit'
          %-  pairs
          :~  ['id' (numb id.q.lgd)]
              ['name' s+name.q.lgd]
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

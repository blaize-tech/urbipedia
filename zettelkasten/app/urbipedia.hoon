/-  *urbipedia
/+  default-agent, dbug, agentio
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =nodes =actions =links]
+$  card  card:agent:gall
++  z-orm  ((on id zettel) gth)
++  link-orm  ((on id link) gth)
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
++  on-init
  ^-  (quip card _this)
  :_  this
  :~  (~(arvo pass:io /bind) %e %connect `/'updates' %urbipedia)
  ==
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-vase=vase
  ^-  (quip card _this)
  `this(state !<(versioned-state old-vase))
::
++  on-poke
  |=  [=mark =vase]
  |^  ^-  (quip card _this)
  ?>  (team:title our.bowl src.bowl)
  =^  cards  state
    ?+  mark  (on-poke:def mark vase)
      %urbipedia-action  (poke-action !<(action vase))
    ==
  [cards this]
  ++  poke-action
    |=  act=action
    ^-  (quip card _state)
    ?-    -.act
        %create-node
      =/  =id
        =/  rng  ~(. og eny.bowl)
        |-
        =^  n  rng  (rads:rng (bex 32)):: $TODO
        ?.  (has:z-orm nodes n)
          n
        $(rng rng)
      =/  =zettel  [name.act '' '']
      :_  state(nodes (put:z-orm nodes id zettel))
      :~  (fact:io urbipedia-update+!>(`update`[%node-created id]) ~[/updates])
      ==
    ::
        %create-link
      =/  =id
        =/  rng  ~(. og eny.bowl)
        |-
        =^  n  rng  (rads:rng (bex 32)):: $TODO
        ?.  (has:link-orm links n)
          n
        $(rng rng)
      :_  state(links (put:link-orm links id link.act))
      :~  (fact:io urbipedia-update+!>(`update`[%link-created id]) ~[/updates])
      ==
    ::
        %delete-node
      ?>  (has:z-orm nodes id.act)
      :_  state(nodes +:(del:z-orm nodes id.act))
      :~  (fact:io urbipedia-update+!>(`update`[%node-deleted id.act]) ~[/updates])
      ==
    ::
        %delete-link
      ?>  (has:link-orm links id.act)
      :_  state(links +:(del:link-orm links id.act))
      :~  (fact:io urbipedia-update+!>(`update`[%link-deleted id.act]) ~[/updates])
      ==
    ::
        %rename-node
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.act content.old tags.old]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io urbipedia-update+!>(`update`[%node-renamed id.act]) ~[/updates])
      ==
    ::
        %update-content
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.act tags.old]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io urbipedia-update+!>(`update`[%content-updated id.act]) ~[/updates])
      ==
    ::
        %update-tags
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.old tags.act]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io urbipedia-update+!>(`update`[%tags-updated id.act]) ~[/updates])
      ==
    ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  (team:title our.bowl src.bowl)
  ?+  path  (on-watch:def path)
    [%updates ~]  `this
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  (team:title our.bowl src.bowl)
  ?+    path  (on-peek:def path)
      [%x %entries *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %urbipedia-update
      !>  ^-  update
      [%zttls (turn (tap:z-orm nodes) head)]
    ::
        [%ids @ ~]
      =/  =id  (rash i.t.t.t.path dem)
      :^  ~  ~  %urbipedia-update
      !>  ^-  update
      [%zttl (need (get:z-orm nodes id))]
    ==
  ::
      [%x %updates *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %urbipedia-update
      !>  ^-  update
      [%acts actions]
    ==
  ::
      [%x %links *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %urbipedia-update
      !>  ^-  update
      [%lnks (turn (tap:link-orm links) head)]
    ::
        [%ids @ ~]
      =/  =id  (rash i.t.t.t.path dem)
      :^  ~  ~  %urbipedia-update
      !>  ^-  update
      [%lnk (need (get:link-orm links id))]
    ==
  ::
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--

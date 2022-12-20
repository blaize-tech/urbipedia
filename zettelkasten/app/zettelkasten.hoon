/-  *zettelkasten
/+  default-agent, dbug, agentio
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =nodes =log =links]
+$  card  card:agent:gall
++  z-orm  ((on id zettel) gth)
++  link-orm  ((on id link) gth)
++  log-orm  ((on @ action) lth)
++  unique-time
  |=  [=time =log]
  ^-  @
  =/  unix-ms=@
    (unm:chrono:userlib time)
  |-
  ?.  (has:log-orm log unix-ms)
    unix-ms
  $(time (add unix-ms 1))
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
++  on-init  on-init:def
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
  ^-  (quip card _this)
  |^
  ?>  (team:title our.bowl src.bowl)
  ?.  ?=(%zettelkasten-action mark)  (on-poke:def mark vase)
  =/  now=@  (unique-time now.bowl log)
  =/  act  !<(action vase)
  =.  state  (poke-action act)
  :_  this(log (put:log-orm log now act))
  ~[(fact:io zettelkasten-update+!>(`update`[now act]) ~[/updates])]
  ::
  ++  poke-action
    |=  act=action
    ^-  _state
    ?-    -.act
        %create-node
      =/  =id
        =/  rng  ~(. og eny.bowl)
        |-
        =^  n  rng  (rads:rng (bex 256))
        ?.  (has:z-orm nodes n)
          n
        $(rng rng)
      =/  =zettel  [name.act name.act name.act]
      state(nodes (put:z-orm nodes id zettel))
    ::
        %create-link
      =/  =id
        =/  rng  ~(. og eny.bowl)
        |-
        =^  n  rng  (rads:rng (bex 256))
        ?.  (has:link-orm links n)
          n
        $(rng rng)
      state(links (put:link-orm links id link.act))
    ::
        %delete-node
      ?>  (has:z-orm nodes id.act)
      state(nodes +:(del:z-orm nodes id.act))
    ::
        %delete-link
      ?>  (has:link-orm links id.act)
      state(links +:(del:link-orm links id.act))
    ::
        %rename-node
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.act content.old tags.old]
      state(nodes (put:z-orm nodes id.act new))
    ::
        %update-content
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.act tags.old]
      state(nodes (put:z-orm nodes id.act new))
    ::
        %update-tags
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.old tags.act]
      state(nodes (put:z-orm nodes id.act new))
    ::
        %add
      ?<  (has:z-orm nodes id.act)
      =/  =zettel  [txt.act txt.act txt.act]
      state(nodes (put:z-orm nodes id.act zettel))
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
  =/  now=@  (unm:chrono:userlib now.bowl)
  ?+    path  (on-peek:def path)
      [%x %entries *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttls (tap:z-orm nodes)]
    ::
        [%before @ @ ~]
      =/  before=@  (rash i.t.t.t.path dem)
      =/  max=@  (rash i.t.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttls (tab:z-orm nodes `before max)]
    ::
        [%ids @ ~]
      =/  =id  (rash i.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttl (need (get:z-orm nodes id))]
    ==
  ::
      [%x %updates *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %logs (tap:log-orm log)]
    ::
        [%since @ ~]
      =/  since=@  (rash i.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %logs (tap:log-orm (lot:log-orm log `since ~))]
    ==
  ::
      [%x %links *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %lnks (tap:link-orm links)]
    ::
        [%ids @ ~]
      =/  =id  (rash i.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %lnk (need (get:link-orm links id))]
    ==
  ::
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--

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
        %add
      ?<  (has:z-orm nodes id.act)
      =/  =zettel  [txt.act txt.act txt.act]
      state(nodes (put:z-orm nodes id.act zettel))
    ::
        %edit
      ?>  (has:z-orm nodes id.act)
      =/  =zettel  [txt.act txt.act txt.act]
      state(nodes (put:z-orm nodes id.act zettel))
    ::
        %del
      ?>  (has:z-orm nodes id.act)
      state(nodes +:(del:z-orm nodes id.act))
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
      [%x %links *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %lnks (tap:link-orm links)]
    ==
  ::
      [%x %entries *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttl (tap:z-orm nodes)]
    ::
        [%before @ @ ~]
      =/  before=@  (rash i.t.t.t.path dem)
      =/  max=@  (rash i.t.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttl (tab:z-orm nodes `before max)]
    ::
        [%between @ @ ~]
      =/  start=@
        =+  (rash i.t.t.t.path dem)
        ?:(=(0 -) - (sub - 1))
      =/  end=@  (add 1 (rash i.t.t.t.t.path dem))
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttl (tap:z-orm (lot:z-orm nodes `end `start))]
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
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--

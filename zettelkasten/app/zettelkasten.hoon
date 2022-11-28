/-  *zettelkasten
/+  default-agent, dbug, agentio
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =zettelkasten =log]
+$  card  card:agent:gall
++  j-orm  ((on id txt) gth)
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
      ?<  (has:j-orm zettelkasten id.act)
      state(zettelkasten (put:j-orm zettelkasten id.act txt.act))
    ::
        %edit
      ?>  (has:j-orm zettelkasten id.act)
      state(zettelkasten (put:j-orm zettelkasten id.act txt.act))
    ::
        %del
      ?>  (has:j-orm zettelkasten id.act)
      state(zettelkasten +:(del:j-orm zettelkasten id.act))
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
      [now %jrnl (tap:j-orm zettelkasten)]
    ::
        [%before @ @ ~]
      =/  before=@  (rash i.t.t.t.path dem)
      =/  max=@  (rash i.t.t.t.t.path dem)
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %jrnl (tab:j-orm zettelkasten `before max)]
    ::
        [%between @ @ ~]
      =/  start=@
        =+  (rash i.t.t.t.path dem)
        ?:(=(0 -) - (sub - 1))
      =/  end=@  (add 1 (rash i.t.t.t.t.path dem))
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %jrnl (tap:j-orm (lot:j-orm zettelkasten `end `start))]
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

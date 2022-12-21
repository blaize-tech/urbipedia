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
++  on-init
  ^-  (quip card _this)
  :_  this
  :~  (~(arvo pass:io /bind) %e %connect `/'updates' %zettelkasten)
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
      %zettelkasten-action  (poke-action !<(action vase))
    ==
  [cards this]
  ++  poke-action
    |=  act=action
    ^-  (quip card _state)
    =/  now=@  (unique-time now.bowl log)
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
      :_  state(nodes (put:z-orm nodes id zettel))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl zettel]]) ~[/updates])
      ==
    ::
        %create-link
      =/  =id
        =/  rng  ~(. og eny.bowl)
        |-
        =^  n  rng  (rads:rng (bex 256))
        ?.  (has:link-orm links n)
          n
        $(rng rng)
      :_  state(links (put:link-orm links id link.act))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
      ==
    ::
        %delete-node
      ?>  (has:z-orm nodes id.act)
      :_  state(nodes +:(del:z-orm nodes id.act))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
      ==
    ::
        %delete-link
      ?>  (has:link-orm links id.act)
      :_  state(links +:(del:link-orm links id.act))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
      ==
    ::
        %rename-node
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.act content.old tags.old]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
      ==
    ::
        %update-content
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.act tags.old]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
      ==
    ::
        %update-tags
      ?>  (has:z-orm nodes id.act)
      =/  old=zettel  (got:z-orm nodes id.act)
      =/  new=zettel  [name.old content.old tags.act]
      :_  state(nodes (put:z-orm nodes id.act new))
      :~  (fact:io zettelkasten-update+!>(`update`[now [%zttl ['' '' '']]]) ~[/updates])
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
  =/  now=@  (unm:chrono:userlib now.bowl)
  ?+    path  (on-peek:def path)
      [%x %entries *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %zttls (turn (tap:z-orm nodes) head)]
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
    ==
  ::
      [%x %links *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %zettelkasten-update
      !>  ^-  update
      [now %lnks (turn (tap:link-orm links) head)]
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

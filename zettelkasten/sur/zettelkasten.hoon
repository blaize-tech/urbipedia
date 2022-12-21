|%
+$  id  @
+$  content  @t
+$  name  @t
+$  tags  @t
+$  link
  $:  from=id
      to=id
  ==
+$  zettel
  $:  =name
      =content
      =tags
  ==
+$  action
  $%  [%create-node =name]
      [%create-link =link]
      [%delete-node =id]
      [%delete-link =id]
      [%rename-node =id =name]
      [%update-content =id =content]
      [%update-tags =id =tags]
  ==
+$  entry  [=id =zettel]
+$  elink  [=id =link]
+$  logged  (pair @ action)
+$  update
  %+  pair  @
  $%  action
      [%zttls list=(list id)]
      [%logs list=(list logged)]
      [%lnks list=(list id)]
      [%lnk lnk=link]
      [%zttl zttl=zettel]
  ==
+$  nodes  ((mop id zettel) gth)
+$  links  ((mop id link) gth)
+$  log  ((mop @ action) lth)
--

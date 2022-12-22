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
+$  logged  action
+$  update
  $%  action
      [%zttls list=(list id)]
      [%logs list=(list logged)]
      [%lnks list=(list id)]
      [%lnk lnk=link]
      [%zttl zttl=zettel]
      [%node-created =id]
      [%node-renamed =id]
      [%content-updated =id]
      [%tags-updated =id]
      [%link-created =id]
      [%node-deleted =id]
      [%link-deleted =id]
  ==
+$  nodes  ((mop id zettel) gth)
+$  links  ((mop id link) gth)
+$  log  (list action)
--

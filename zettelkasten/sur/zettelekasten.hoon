|%
+$  id  @
+$  name  @t
+$  txt  @t
+$  countIds  @
+$  link  (id=@ type=@)
+$  links  (list link)
+$  tag @t
+$  zettel
  $:  =name
      =txt
      =links
      tags=(list tag)
  ==
+$  zettels (map id zettel)
+$  action
  $%  [%new =name =txt]
      [%add-tag =name =tag]
      [%del-tag =name =tag]
      [%add-link from=name to=name type=@]
      [%del-link link=@t]
      [%edit =name =txt]
      [%del =name]
  ==
+$  entry  [=id =txt]
+$  logged  (pair @ action)
+$  update
  %+  pair  @
  $%  action
      [%jrnl list=(list entry)]
      [%logs list=(list logged)]
  ==
+$  zettelkasten  ((mop id txt) gth)
+$  log  ((mop @ action) lth)
--

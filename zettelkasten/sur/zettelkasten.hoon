|%
+$  id  @
+$  txt  @t
+$  name  @t
+$  link
  $:  from=id
      to=id
  ==
+$  zettel
  $:  =name
      =txt
      tags=@t
  ==
+$  action
  $%  [%add =id =txt]
      [%edit =id =txt]
      [%del =id]
  ==
+$  entry  [=id =zettel]
+$  elink  [=id =link]
+$  logged  (pair @ action)
+$  update
  %+  pair  @
  $%  action
      [%lnks list=(list elink)]
      [%zttl list=(list entry)]
      [%logs list=(list logged)]
  ==
+$  nodes  ((mop id zettel) gth)
+$  links  ((mop id link) gth)
+$  log  ((mop @ action) lth)
--

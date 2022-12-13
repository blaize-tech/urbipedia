|%
+$  id  @
+$  txt  @t
+$  name  @t
+$  zettel
  $:  =name
      =txt
      :: =links
      :: tags=(list tag)
  ==
+$  action
  $%  [%add =id =txt]
      [%edit =id =txt]
      [%del =id]
  ==
+$  entry  [=id =txt]
+$  logged  (pair @ action)
+$  update
  %+  pair  @
  $%  action
      [%zttl list=(list entry)]
      [%logs list=(list logged)]
  ==
+$  journal  ((mop id txt) gth)
+$  log  ((mop @ action) lth)
--

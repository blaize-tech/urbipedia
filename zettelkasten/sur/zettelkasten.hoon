|%
+$  id  @
+$  name  @t
+$  txt  @t
+$  count  @ta
+$  link  [=id type=@]
+$  links  (list link)
+$  tag  @t
+$  zettel
  $:  =name
      =txt
      :: =links
      :: tags=(list tag)
  ==
+$  action
  $%  [%add =id =name =txt]
      [%edit =id =name =txt]
      [%del =id]
  ==
+$  entry  [=id =zettel]
+$  logged  (pair @ action)
+$  update
  %+  pair  @
  $%  action
      [%zttl list=(list entry)]
      [%logs list=(list logged)]
  ==
+$  zettels  ((mop id zettel) gth)
+$  log  ((mop @ action) lth)
--

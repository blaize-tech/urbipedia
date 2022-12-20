/-  *zettelkasten
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  |^  ^-  action
  %.  jon
  %-  of
  :~  [%create-node (ot ~[name+so])]
      [%create-link (ot ~[link+de-link])]
      [%delete-node (ot ~[id+ni])]
      [%delete-link (ot ~[id+ni])]
      [%rename-node (ot ~[id+ni name+so])]
      [%update-content (ot ~[id+ni content+so])]
      [%update-tags (ot ~[id+ni tags+so])]
      [%add (ot ~[id+ni txt+so])]
  ==
  ++  de-link  (ot ~[from+ni to+ni])
  --
--


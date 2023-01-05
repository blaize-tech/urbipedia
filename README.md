# Urbitpedia
NOTE: This code is not audited and should not be used in production environment.

# Summary
Urbitpedia is an encyclopedia, written and maintained by users for all Urbit community.

Two type of users:
1. Admin - with permission to write.
2. Regular - read only.

Urbitpedia implements the Zettelkasten method of storing information.

Zettelkasten - small items of information stored like note that may be linked to each other through subject headings or other metadata such as numbers and tags.It has often been used as a system of note-taking and personal knowledge management for research, study, and writing.

# Overview
Admin users create notes of information with links to other notes by linkage or tags. 
Regular users can interact with this system of information.

# Requirements
Urbit - https://urbit.org/getting-started

# Install
Run urbit.
|merge %urbitpedia our %webterm
|mount %urbitpedia
Copy content of zettelkasten folder into {$your-planet}/urbitpedia
|commit %urbitpedia
|install our %urbitpedia

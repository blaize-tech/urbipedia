# Urbipedia
NOTE: This code is not audited and should not be used in production environment.

# Summary
Urbipedia is an encyclopedia, written and maintained by users for all Urbit community.

Two type of users:
1. Admin - with permission to write.
2. Regular - read only.

Urbipedia implements the Zettelkasten method of storing information.

Zettelkasten - small items of information stored like note that may be linked to each other through subject headings or other metadata such as numbers and tags.It has often been used as a system of note-taking and personal knowledge management for research, study, and writing.
![image](https://user-images.githubusercontent.com/99647044/210794083-d07462b9-cfd0-4e5e-bc69-15f4397c442d.png)
![image](https://user-images.githubusercontent.com/99647044/210794214-e7d3c596-3ecf-41cd-a811-dbdf0a12a1ac.png)

# Overview
Admin users create notes of information with links to other notes by linkage or tags. 
Regular users can interact with this system of information.

# Requirements
Urbit - https://urbit.org/getting-started

# Install
Run urbit.

|merge %urbipedia our %webterm

|mount %urbipedia

Copy content of zettelkasten folder into {$your-planet}/urbipedia

|commit %urbipedia

|install our %urbipedia

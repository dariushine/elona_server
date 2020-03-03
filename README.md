# elona_server

This is a chat server for Elona. 

It's based on [Ruin0x11's elona server](https://github.com/Ruin0x11/elona_server), but this is a docker-compose project using NodeJS (with Express) and PostgreSQL.

It's still under development.

## How to setup locally

You need docker and docker-compose.

First, change the user and password for the database in the docker-compose.yml file.

User: change the `PGUSER` and `POSTGRES_USER` environment variables

Password: change the `PGPASSWORD` and `POSTGRES_PASSWORD` environment variables

After doing that, just open a terminal in the main folder and execute the following command:

```docker-compose -f docker-compose.yml up```

It will start the Nodejs server and the Postgresql server in their respective containers. If you want to open it in debug mode (not recommended unless you know what you're doing), execute this command instead:

```docker-compose up```

In debug mode it runs another container with Adminer at port 8080, so you can open the database and edit it or whatever.

## Important information

From [ruin0x11's project](https://github.com/Ruin0x11/elona_server):

> If the serverList option in the "config.txt" file is set to 1 or the game is started with no Internet connection, the servers listed in the "server.txt" file in the game directory will be used.  
>  
> Format of the "server.txt" file:  
>  
> ```chat.server.hostname%voting.server.hostname%```  
>  
> Note that the game prepends www. to both hostnames before resolving them. The moongate server hostname is hardcoded, so an official update/patch to decompiled HSP would have to be made.  

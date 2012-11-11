The App
=======

Usage
-----
When prompted to sign in, create a new account.
![create acc](http://i.imgur.com/6aCUZ.png)

Hitting the top bar wil reveal the side-menu:
![side](http://i.imgur.com/yjpY4.png)

Add contacts by hitting the add contact button:
![add](http://i.imgur.com/CHkRi.png)

click on someone on your contacts list to chat with them!
![chat](http://i.imgur.com/NKL8L.png)

Click edit profile in the side-menu to change your name and/or profile picture (uses gravatar)
![profile](http://i.imgur.com/nqfuK.png)

Happy chatting!
Short description of functions called
-------------------------------------
Many many many functions are called. Enumerating them here would be redundant. The code is well documented and for
any unclarities, you can always refer to the Meteor framework documentation. 
[Docs](http://docs.meteor.com/)


About
-----

I've written a HTML5/CSS3 chat application which runs on the [Meteor](http://meteor.com) platform.
You can change your profile picture, profile name, add new contacts and send messages to them.

The profile pictures are loaded from the [Gravatar](http://gravatar.com) database. If no profile picture is found
in the gravatar database, a default picture is used.

Messaging happens through a local-global sync between a local database and a server database.
They sync data over a websocket line. The server sets up rules who can see which information on the lines and
sets up what data is synchronized between the server and the client.
For example, when someone is logged in, he will only be able to sync the local database with parts of the server
database that holds information about chat messages sent by the user or by one of the contacts of the user. Any
other data is not accessible for the user.

Through these predefined set of rules, privacy is maintained in the chat application. You can only read data
that is meant for you, and can only write data when this data is validated by the server.

The meteor framework has a built-in log-in widget which authenticates users with the database.

Interface
---------
The interface is loosely based on the facebook chat app. You can access the side-menu by tapping the header
of the app. You can then perform actions like selecting chats, changing your settings, logging out, or adding more
contacts. 



Known bugs
==========
When a message is sent, the timestamp is set on the clientside. If the clocks of two chatters aren't in sync,
the timestamp might look invalid for the receiving end. This can be fixed by settings timestamps on the serverside
when synchronizing the local database with the server database.

If no chat is specifically opened (the state you're in after log in), there's still a chat window visible in
which you can send messages, whilst those messages aren't received by anyone in particular.


On Google Chrome for Android 4.1 the following bug has occured:
    When the side-menu is open, the app works fine. You can send messages, scroll through messages etc
    When the side-menu is closed, the scrolling through the app breaks. Haven't been able to find out why yet.





Meteor
======

Pure JavaScript
---------------
The entire app is written in pure JavaScript. All the same APIs are available on the client and the server,
so the same code can easily run in either environment.

Live page updates
-----------------
The template automatically update when data in the database changes. No boilerplate redrawcode to write.

Clean, powerful data synchronisation.
-------------------------------------
The client code is written as if it were runnning on the server and had direct access on the database.
This is made possible through a local-copy database that synchronizes with the server-side one every once 
in a while. If rules are violated, the server will restore the local copy of the database to a correct state.
This way, illegal procedures can never be executed, and privacy is guarenteed.

Latency compensation.
---------------------
When a user makes a change, the screen updates automatically, no need to wait for a rountrip to the server.
If the server eventually synchronizes, and rejects the data update, the client is patched up with what actually
happend. This is what makes it possible to send messages to the server even when the connection is down.
The client will update already, wait for the sync, and then the server will have the update already.
This is the major advantage of having a local copy database!

Hot code push
-------------
The app is automatically updated without disturbing current users. As soon as a new version is uploaded,
the code on the web page changes dynamically without the user noticing. No data loss, no need to refresh the
page.


Sensitive code runs in privileged environment.
----------------------------------------------
The user interface runs in the browser. Sensitivte functions explicitly and implicitly are run on the server.
This too will protect privacy.




Database
========

Serverside: MongoDB
clientside: MiniMongo

MiniMongo is a local (localStorage) copy of the server-side database. Server server will set restrictions on what data
can be copied to the local database.  This local database is used to send all data to in the clientside app
this local database will be flush to the serverside database when there is a connection.
The result is, if you lose connectivity you can resume sending messages, as soon as the signal is back,
the messages will be sent to the server-side database. This way the app also works in bad connectivity.

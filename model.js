Chats = new Meteor.Collection("Chats");
/*
By default, you cannot modify a collection (insert, update, remove).
We will have to specify specific behaviour for when the clients does
have to  modify a collection 
*/

Chats.allow({
	insert: function (userId, chat) {
		
	},
	update: function (userId, chats, fields, modifier) {
		return _.contains(chat.participants, userId) && _.size(chat.participants) == 2;
	},

	// for this moment, you cannot remove chat messages
	remove: function (userId, chat) {
		return false;
	}
});

//TODO, zie client.js, hier die shizzle stoppen :)
Meteor.users.allow({
	update: function (userId, users, fields, modifier) {

		throw new Meteor.error(fields);
		// _.all(users, function (user) {

		// 	//
		// 	if (_.contains(user.contacts, userId)) {

		// 	}
		// });
		// throw new Meteor.Error("YO DAWG");
		// return false;



		//TODO "You already have this contact!"
		//TODO "You can't add yourself!"
		//TODO "That user isn't using meteorchat yet!"
	},

	fetch : ["contacts"]
});


/* define RPC calls

These are methods that the client can invoke on the server.
So called remote procedures.
*/
Meteor.methods({
	addContact: function (email) {

		if (!email.match(/.+@.+/)) {
			throw new Meteor.Error(400, "Invalid email address was sent");
		}

		var newContact = Meteor.users.findOne({
			emails: {
				$in: [
					{address: email,verified:false}, //for debugging, cant verifiy in localhost
					{address: email, verified:true}
				]
			}
		});

		if (!newContact) {
			throw new Meteor.Error(404, "This contact isn't using meteorchat yet!");
		}

		if (_.contains(Meteor.user().contacts, newContact._id)) {
			throw new Meteor.Error(400, "You've already added this contact!");
		}

		if (Meteor.userId() == newContact._id) {
			throw new Meteor.Error(400, "You cannot add yourself!");
		}


		return Meteor.users.update({_id:Meteor.userId()}, {$push: {contacts : newContact._id}}, true);
	}
});
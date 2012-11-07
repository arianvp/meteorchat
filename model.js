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

Meteor.methods({
	createChat: function (other) {

		return Chats.insert({
			participants: [this.userId, other]
		});
	}
});
/*
 * Chats collection is saved in the database as follows:
 * {
 *  participants : [User],
 *  messages: [
 *      sender: User,
 *      timestamp: Date,
 *      text: String
 *  ]
 *  
 * }
 * 
 */

Chats = new Meteor.Collection("chats");
/*
By default, you cannot modify a collection (insert, update, remove).
We will have to specify specific behaviour for when the clients does
have to  modify a collection 
*/

Chats.allow({
	insert: function (userId, chat) {
		return _.all(chat.participants, function (part) {
			return part !== "" || part !== undefined || part !== null;
		});
	},
	update: function (userId, chats, fields, modifier) {
		return _.all(chats, function (chat) {
			return _.contains(chat.participants, userId);
		});
	},

	// for this moment, you cannot remove chat messages
	remove: function (userId, chat) {
		return false;
	},
	fetch: ["participants", "messages"]
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
                
                // search for a contact that has the email address that the client entered in the
                // add contact dialog
		var newContact = Meteor.users.findOne({
			emails: {
				$in: [
					{address: email,verified:false}, //for debugging, cant verifiy in localhost
					{address: email, verified:true}
				]
			}
		});

                // we'll have to check if this contact is already a meteorchat user, otherwise report not.
		if (!newContact) {
			throw new Meteor.Error(404, "This contact isn't using meteorchat yet!");
		}

                // if your contactlist already contains this contact, this should be considered an error
                // you shouldn't be able to add the same contact twice.
		if (_.contains(Meteor.user().contacts, newContact._id)) {
			throw new Meteor.Error(400, "You've already added this contact!");
		}

                //you cannot add yourself...
		if (Meteor.userId() == newContact._id) {
			throw new Meteor.Error(400, "You cannot add yourself!");
		}
                // add the contact
		return Meteor.users.update({_id:Meteor.userId()}, {$push: {contacts : newContact._id}}, true);
	}
});

/*
The user can read all his own data
*/
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {contacts: 1}});
});

/*
 * When the server publishes the list of contacts to the client, the client can only see the
 * email adressess and the profiles of the contacts. Any other information is hidden for privacy
 * reason
 * When the server publishes the list of contacts to the client, the client can only see the
 * email adressess and the profiles of the contacts. Any other information is hidden for privacy
 * reasons
 */
Meteor.publish("allUserData", function () {
	return Meteor.users.find({}, {fields: { emails: 1, profile: 1}});
});

/*
 * When publishing chats to a client, he can only sync chats to the local database
 * where he participates in. This is a privacy measure
 */
Meteor.publish("chats", function (contactId) {
	return Chats.find({participants: {$all: [this.userId, contactId]}});
});


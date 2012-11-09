/*
The user can read all his own data
*/
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {contacts: 1}});
});

Meteor.publish("allUserData", function () {
	return Meteor.users.find({}, {fields: { emails: 1, profile: 1}});
});

Meteor.publish("chats", function (contactId) {
	return Chats.find({participants: {$all: [this.userId, contactId]}});
});


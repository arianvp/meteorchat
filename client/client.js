Chats = new Meteor.Collection("Chats");
Meteor.subscribe("userData");

Template.contacts.contacts = function () {
  return Meteor.user().contacts;
};
/* The Chats Router
 * It will handle requests to URLs in the form of /:chatId,
 * set the current chat id in localStorage to the chatId of the URL,
 * and finally reset the search filter in localStorage.
 */
var ChatsRouter = Backbone.Router.extend({
  routes: {
    ":chatId": "main"
  },

  // the main router function
  main: function (chatId) {
    Session.set("chatId", chatId);
    Session.set("searchFilter", null);
  },

  // a helper function to navigate to a specific chat
  setChat: function (chatId) {
    this.navigate(chatId, true);
  }
});

Router = new ChatsRouter();
Chats = new Meteor.Collection("Chats");
Meteor.subscribe("userData");

Handlebars.registerHelper("whichUser", function  (message) {
  if (message.sender == Meteor.userId()) {
    return "me";
  }  else {
    return "he";
  }
});

/*
 * Retreives the contactlist from the database and feeds it to
 * the contacts template, which will render the contacts in html
 */
Template.contacts.contacts = function () {
  return [  {name: "Dirk Maas"},
            {name: "Joyce Vrenken"},
            {name: "Berend van Deelen"}
    ];
};

/*
 * Retreives the messages of the current chat from the database
 * and feeds them to the messages template,
 * which will render the messages in html
 */
Template.messages.messages = function () {

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


// gets called when the DOM is ready
Meteor.startup(function () {
  $('body > aside, body > section').toggleClass('slide'); // debug
});
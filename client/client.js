/**

NOTE about the storage API usage




I've used sessionStorage instead of localStorage in the rest of the app for the following reason:
 *  sessionStorage only spans a single 'session' so it only applies to one window.
    Because my app is a single-page app, we don't share state amongst different pages, thus the localStorage is obsolete.
    The assignment explicitly stated to use 'localStorage' and not 'sessionStorage'. But I am sure that this statement was
    used to say "Use the HTML5 Storage API (http://www.html5rocks.com/en/features/storage)"  sessionStorage is part of this API

    In my app, the sessionStorage object is wrapped in a Session object, but on the background it's the same. It's a compactibilty
    layer to support more browsers.

    Session is also reactive, it updates any component that uses it automatically.

localStorage IS used to store the loginToken and userId.   because in the future, I might add more pages that require the user to be logged in
**/
/*
Set up data subscriptions with the server.
See server/server.js for more info on these subscriptions
*/
Meteor.subscribe("userData");
Meteor.subscribe("allUserData");
// Determines
Handlebars.registerHelper("whichUser", function  (message) {
  //TODO
  if (message.name === "Arian van Putten") {
    return "me";
  }  else {
    return "he";
  }
});
/*
 * converts a date object in a readable version:
 * For example :
 *   * Just now  // smaller than a minute
 *   * 1 minute ago
 *   * x minutes ago
 *   * 1 hour ago
 *   * x hours ago
 *   * Yesterday
 *   * x days ago
 *   * x weeks ago
 */
Handlebars.registerHelper("prettyDate", function (date) {

  var now = new Date();
  var difference = (now.getTime() - date.getTime()) / 1000;
  var dayDifference = Math.floor(difference / 86400);
  if (dayDifference === 0) {
    if (difference < 60) {
      return "Just now";
    } else if (difference < 120) {
      return "1 minute ago";
    } else if (difference < 3600) {
      return Math.floor(difference / 60) + " minutes ago";
    } else if (difference < 7200) {
      return "1 hour ago";
    } else if (difference < 86400) {
      return Math.floor(difference / 3600) + " hours ago";
    }
  } else if (dayDifference == 1) {
    return "Yesterday";
  } else if (dayDifference < 7) {
    return dayDifference + " days ago";
  } else if (dayDifference < 31) {
    return Match.ceil(dayDifference / 7) + " weeks ago";
  }
});


/* Dialog pop up control */
Template.page.showAddContactDialog = function () {
  return !!Session.get("showAddContactDialog"); // !! is for null case, !!null === false
};

Template.page.showEditProfileDialog = function () {
  return !!Session.get("showEditProfileDialog");
};

/*
Handles page events
*/
Template.page.events = {
  // if the page header is clicked, reveal the sidebar
  "click #main > header" : function (e) {
    $("#main, #side-menu, #main > header, #send-message-form ").toggleClass("slide");
  }
};


/************** Contacts Menu **************/
Template.addContactDialog.events = {
  "click .cancel" : function () {
    Session.set("showAddContactDialog", false);
  },
  "click .submit" : function () {
    var email = $("#contact-email").val();
    Meteor.call("addContact", email, function (error, result) {
      if(error) {
        Session.set("addContactError", error.reason);
      } else {
        Session.set("addContactError", undefined);
        Session.set("showAddcontactDialog", false);
      }
    });
  }
};

Template.addContactDialog.error = function () {
  return Session.get("addContactError");
};

/*
 * Retreives the contactlist from the database and feeds it to
 * the contacts template, which will render the contacts in html
 */
Template.contacts.contacts = function () {
  return _.map(_.map(Meteor.user().contacts, function (id) {return Meteor.users.findOne(id);}), function (contact) {
    //TODO , set avatar to preselected by user thingy
    contact.gravatar = Gravatar.imageUrl(contact.emails[0].address);
    contact.profile = contact.profile || {};
    contact.profile.name = contact.profile.name || contact.emails[0].address;
    return contact;
  });
};

Template.contacts.events = {
  "click #add-contact" : function (e) {
    Session.set("showAddContactDialog", true);
  }
};


/************* Settings Menu *********/
Template.editProfileDialog.image = function () {
  if (Meteor.userLoaded()) {
    return Gravatar.imageUrl(Meteor.user().emails[0].address);
  }
};

Template.editProfileDialog.profile = function () {
  if (Meteor.userLoaded()) {
    return Meteor.user().profile || {name:Meteor.user().emails[0].address};
  }
};

Template.editProfileDialog.events = {

  "click .cancel" : function () {
    Session.set("showEditProfileDialog", false);
  },
  "click .submit" : function () {
    var name = $("#name").val();
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.name": name}}, true);
  }

};

Template.settings.events = {
  "click #edit-profile" : function () {
    Session.set("showEditProfileDialog", true);
  }
};



//TODO
/*
 * Retreives the messages of the current chat from the database
 * and feeds them to the messages template,
 * which will render the messages in html
 */
Template.messages.messages = function () {
  return [
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Whadduppppp"
    },
    {
      name: "Arian van Putten",
      timestamp: new Date(),
      text: "Heyyyyy"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    },
    {
      name: "Dirk Maas",
      timestamp: new Date(),
      text: "Trolololol"
    }






  ];
};


Template.header.username = function () {
  return "Dirk Maas";
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
  },

  // a helper function to navigate to a specific chat
  setChat: function (chatId) {
    this.navigate(chatId, true);
  }
});

Router = new ChatsRouter();



// gets called when the DOM is ready
Meteor.startup(function () {
  // debug



});
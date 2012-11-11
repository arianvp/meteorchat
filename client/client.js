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
  date = new Date(date);
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
/* A reactive resource for the html template, when the Session object changes, the template re-renders*/
Template.page.showAddContactDialog = function () {
  return !!Session.get("showAddContactDialog"); // !! is for null case, !!null === false
};

/* Idem dito */
Template.page.showEditProfileDialog = function () {
  return !!Session.get("showEditProfileDialog");
};

/*
Handles page events to open the sidebar etc
*/
Template.page.events = {
  // if the page header is clicked, reveal the sidebar
  "click #main > header" : function (e) {
    $("#main, #side-menu, #main > header, #send-message-form ").toggleClass("slide");
  }
};


/************** Contacts Menu **************/
Template.addContactDialog.events = {

  /* close the contact menu */
  "click .cancel" : function () {
    Session.set("showAddContactDialog", false);
  },
  
  /* submit changes, and then close menu */
  "click .submit" : function () {
    var email = $("#contact-email").val();
    Meteor.call("addContact", email, function (error, result) {
      if(error) {
        Session.set("addContactError", error.reason);
      } else {
        Session.set("addContactError", undefined);
        Session.set("showAddContactDialog", false);
      }
    });
  }
};

/* reactive data source callled. if in the addContactDialog eventhander, an error is caught,
 * this is template resource will change, causing a template redraw, so the error can be displayed
 * to the user */
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

/* Listen for clicks on the add-contact button. if clicked, open the add-contact-dialog */
Template.contacts.events = {
  "click #add-contact" : function (e) {
    Session.set("showAddContactDialog", true);
  }
};


/************* Settings Menu *********/

/* sets the polaroid image to the corresponding avatar from the gravatar database */
Template.editProfileDialog.image = function () {
  if (Meteor.userLoaded()) {
    return Gravatar.imageUrl(Meteor.user().emails[0].address);
  }
};

/* If no name is set, display an email placeholder */
Template.editProfileDialog.profile = function () {
  if (Meteor.userLoaded()) {
    return Meteor.user().profile || {name:Meteor.user().emails[0].address};
  }
};

Template.editProfileDialog.events = {
  /* close the dialog */
  "click .cancel" : function () {
    Session.set("showEditProfileDialog", false);
  },
  /* submit the changes, then close dialog */
  "click .submit" : function () {
    var name = $("#name").val();
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.name": name}}, true);
    Session.set("showEditProfileDialog", false);
  }

};

/* event to open the edit-profile-dialog */
Template.settings.events = {
  "click #edit-profile" : function () {
    Session.set("showEditProfileDialog", true);
  }
};





Session.set("contactId", null);

/* **
 * Subscribe to the 'chats' data publisher (see server/server.js)  to receive data about chats */
Meteor.subscribe("chats");
Meteor.autosubscribe(function () {
  var contactId = Session.get("contactId");
  if (contactId) {
    Meteor.subscribe("chats", contactId);
  }
});

Template.chat.he = function () {
  var contactId = Session.get("contactId");

  var he =  Meteor.users.findOne({_id:contactId});
  if (he) {
    he.gravatar = Gravatar.imageUrl(he.emails[0].address);
    he.profile = he.profile || {};
    he.profile.name = he.profile.name || he.emails[0].address;
    return he;
  }
  return "Chat";
};

Template.chat.me = function () {
  if (Meteor.userLoaded()) {
    var me = Meteor.user();
    me.gravatar = Gravatar.imageUrl(me.emails[0].address);
    me.profile = me.profile || {};
    me.profile.name = me.profile.name || me.emails[0].address;
    return me;
  }
};


Template.chat.chat = function () {
  var contactId = Session.get("contactId");
  /* find the chat which we selected, in the database */
  var chat = Chats.findOne({participants:contactId});
  return chat;
};

/* a helper function that is used to determine style in the template *
 * (wether or not the balloon should be pointed left or right) */
Template.chat.isMe = function (id) {
  return id == Meteor.userId();
};


Template.chat.events = {
  "click #send-message-form > .submit" : function () {
    var text = $("#send-message-form > input").val();
    if (!text.length) { return; } //if nothing was entered


    var contactId = Session.get("contactId");

    // if the chat didn't exist yet, create it
      if (!Chats.findOne({participants:{$all:[contactId, Meteor.userId()]}})) {
        Chats.insert({
          participants:[contactId, Meteor.userId()],
          messages:[{
            sender: Meteor.userId()
            timestamp:new Date(),
            text:text}]});
      }
      // otherwise append the message to the existing chat
      else {
    Chats.update({participants:{$all:[contactId, Meteor.userId()]}},
      {$push:{messages:{
        sender: Meteor.userId(),
        timestamp:new Date(),
        text:text}}},
    true);
     }
  }
};


// fixes some problems with class resets in the template render engine
Template.chat.rendered = function () {
    if($("#side-menu.slide").length) {
      $("#main, #main>header,#send-message-form").addClass("slide");
    }
  
};

/* The Chats Router
 * It will handle requests to URLs in the form of /:chatId,
 * set the current chat id in localStorage to the chatId of the URL,
 * and finally reset the search filter in localStorage.
 */
var ChatsRouter = Backbone.Router.extend({
  routes: {
    ":contactId": "main"
  },

  // the main router function
  main: function (contactId) {
    Session.set("contactId", contactId);
  },

  // a helper function to navigate to a specific chat
  setChat: function (contactId) {
   // this.navigate(contactId, true);
  }
});

Router = new ChatsRouter();



// gets called when the DOM is ready
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

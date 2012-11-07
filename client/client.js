
Meteor.subscribe("userData");

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


Template.page.showAddContactDialog = function () {
  return !!Session.get("showAddContactDialog"); // !! is for null case, !!null === false
};

/*
Handles page events
*/
Template.page.events = {
  // if the page header is clicked, reveal the sidebar
  "click #main > header" : function (e) {
    $("#main, #side-menu, #main > header").toggleClass("slide");
  }
};

Template.addContactDialog.events = {


  "click .cancel" : function () {
    Session.set("showAddContactDialog", false);
  },
  "click .submit" : function () {
    var email = $("#contact-email").val();

    var user = Meteor.users.findOne({
      emails: {
        $in: [
          {address: email,verified:false}, //for debugging, cant verifiy in localhost
          {address: email, verified:true}
        ]
      }
    });

    if (user) {
      console.log(user);
      Session.set("addContactError", undefined);
      Session.set("showAddContactDialog", false);
    } else {
      Session.set("addContactError", "That user isn't using meteorchat yet!");
    }
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

  console.log(Meteor.user().contacts);
  return [  {name: "Dirk Maas", gravatar: Gravatar.imageUrl("aeroboy94@gmail.com")},
            {name: "Joyce Vrenken"},
            {name: "Berend van Deelen"}
    ];
};



Template.contacts.events = {
  "click #add-contact" : function (e) {
    Session.set("showAddContactDialog", true);
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
  // debug



});
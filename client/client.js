Chats = new Meteor.Collection("Chats");
Meteor.subscribe("userData");

Handlebars.registerHelper("whichUser", function  (message) {
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
    }
  ];
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
  $("#open-side-menu").live('click', function(){
    $("#main, #side-menu").toggleClass('slide');
  });
  $("#login-button").live('click',function () {
    console.log("Ik log nu in jeweetzelluf");
    Meteor.loginWithPassword($("#email").val(), $("#password").val(), function (err) {
      if (!err) {

      }
      console.log(err);
    });
  });


});
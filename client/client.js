/* The Chats Router
 * It will handle requests to URLs in the form of /:chat_id,
 * set the current chat id in localStorage to the chat_id of the URL,
 * and finally reset the chat filter in localStorage.
 */
var ChatsRouter = Backbone.Router.extend({
  routes: {
    ":chat_id": "main"
  },

  // the main router function
  main: function (chat_id) {
    Session.set("chat_id", chat_id);
    Session.set("search_filter", null);
  },

  // a helper function to navigate to a specific chat
  setChat: function (chat_id) {
    this.navigate(chat_id, true);
  }
});
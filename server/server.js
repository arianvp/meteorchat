Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'contacts' : 1}});
});

Meteor.publish("allUserData", function () {

});
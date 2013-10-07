/*global Ember*/

var App = window.App = Ember.Application.create({
  // ember related
	LOG_TRANSITIONS: true,
  LOG_BINDINGS: true,
  LOG_VIEW_LOOKUPS: true,
  LOG_STACKTRACE_ON_DEPRECATION: true,
  LOG_VERSION: true,
  debugMode: true,

  // app related
  RESULTS_PER_PAGE: 10
});

/* Order and include as you please. */
// require('scripts/routes/*');
// require('scripts/controllers/*');
// require('scripts/models/*');
// require('scripts/views/*');

App.Router.map(function () {
  this.route('index', { path: '/' } );
  this.route('clubs');
  this.route('clubDetails', {path:'/clubs/:club_id'});
  this.route('players');
  this.route('playerDetails', {path:'/players/:player_id'});

  /*this.resource( 'clubs', function(){
  	this.route('details', {path:'/:club_id'});
  });
  this.resource( 'players', function(){
  	this.route('details', {path:'/:player_id'});
  });*/
});

/*App.Router.reopen({
  location: 'history'
});*/

App.IO = {
  getClub : function(id) {
    return $.getJSON('/api/v1/clubs/' + id);
  },
  getClubs : function(data) {
    return $.getJSON('/api/v1/clubs', data);
  },
  getPlayer : function(id) {
    return $.getJSON('/api/v1/players/' + id);
  },
  getPlayers : function(data) {
    return $.getJSON('/api/v1/players', data);
  }
};

App.Club = Ember.Object.extend({
  
});

App.Player = Ember.Object.extend({
  fullname: function() {
    return this.get('lastname') + ' ' + this.get('firstname');
  }.property('lastname', 'firstname')
});

App.Club.reopenClass({
  loadFromIO : function(id) {
    var instance = this.create({id:id});

    App.IO.getClub(id).then(function(data){
      instance.setProperties(data.club);
    }); 

    return instance;
  },

  createMany : function(data) {
    var items = data.clubs;
    var objItems = [];
    for (var i = 0; i<items.length; i++) {
      objItems.push(this.create(items[i]));
    }
    return objItems;
  }
});

App.Player.reopenClass({
  loadFromIO : function(id) {
    var instance = this.create({id:id});
    var self = this;
    App.IO.getPlayer(id).then(function(data){
      self.createWithClub(data.player, data.clubs, instance);
    }); 

    return instance;
  },

  createWithClub : function(item, clubs, instance) {
    if (!instance)
      instance = this.create(item);
    else
      instance.setProperties(item);

    if (item.clu_id && clubs) {
      for(var i=0; i<clubs.length; i++) {
        if (item.clu_id==clubs[i].id) {
          var clubInstance = App.Club.create(clubs[i]);
          instance.set('clu_id', clubInstance);
          break;
        }
      }
    }

    return instance;
  },

  createMany : function(data) {
      var items = data.players;
      var objItems = [];
      for (var i = 0; i<items.length; i++) {
        objItems.push(App.Player.createWithClub(items[i], data.clubs));
      }
      return objItems;
  }
});

App.IndexController = Ember.ObjectController.extend({

  searchTerm: '',

  clubs: null,
  players: null,
  showMoreClubs: false,
  showMorePlayers: false,

  appendClubs: function(items, append) {    
    if (append)
      this.get('clubs').pushObjects(items);
    else
      this.set('clubs', items);

    this.set('showMoreClubs', items.get('length') === App.RESULTS_PER_PAGE);
  },

  appendPlayers: function(items, append) {
    if (append)
      this.get('players').pushObjects(items);
    else
      this.set('players', items);

    this.set('showMorePlayers', items.get('length') === App.RESULTS_PER_PAGE);
  },

  searchTermDidChange: Ember.observer(function(controller, prop) {

    App.IO.getClubs({q:this.searchTerm}).then(function(data){
      controller.appendClubs(App.Club.createMany(data));
    });

    App.IO.getPlayers({q:this.searchTerm}).then(function(data){
      controller.appendPlayers(App.Player.createMany(data));
    });
  }, 'searchTerm'),

  actions : {
    moreClubs: function() {

      var controller = this,
          clubs = this.get('clubs'),
          length = clubs.length,
          lastObject = clubs[length-1];

      App.IO.getClubs({q:this.searchTerm, after:parseInt(lastObject.code) || 0}).then(function(data){
        controller.appendClubs(App.Club.createMany(data, true));
      });

    },
    morePlayers: function() {

      var controller = this,
          players = this.get('players'),
          length = players.length,
          lastObject = players[length-1];

      App.IO.getPlayers({q:this.searchTerm, after:parseInt(lastObject.code) || 0}).then(function(data){
        controller.appendPlayers(App.Player.createMany(data), true);
      });

    }
  }

});

App.ClubsRoute = Ember.Route.extend({
	model: function() {
	},
  setupController: function(controller, model){
    controller.set('clubs', Ember.A());

    App.IO.getClubs().then(function(data){
      controller.appendClubs(data.clubs);
    });
  }
});

App.ClubsController = Ember.ObjectController.extend({
  clubs: Ember.A(),
  showMoreClubs: true,

  appendClubs: function(items) {
    var objItems = [];
    for (var i = 0; i<items.length; i++) {
      objItems.push(App.Club.create(items[i]));
    }

    this.get('clubs').pushObjects(objItems);
    this.set('showMoreClubs', items.length === App.RESULTS_PER_PAGE);
  },

  actions : {
    more : function() {

      var clubs = this.get('clubs');

      var length = clubs.length;
      var lastObject = clubs[length-1];
      var controller = this;

      App.IO.getClubs({after: parseInt(lastObject.code) || 0}).then(function(data){
        controller.appendClubs(data.clubs, true);
      });

    }
  }
});

App.ClubDetailsRoute = Ember.Route.extend({
  model: function(params){
    return App.Club.loadFromIO(params.club_id);
  },
  setupController: function(controller, club) {
    // when from linkTo, data is from club instance used in link
    // when from reload, data is from model() function

    controller.set('model', club);
    controller.set('club_players', Ember.A());

    App.IO.getPlayers({clu_id:club.id}).then(function(items){
      controller.appendItems(items);
    });

  }
});

App.ClubDetailsController = Ember.ObjectController.extend({
  club_players: Ember.A(),
  showMore: true,

  appendItems: function(data) {

    var items = data.players;
    var objItems = [];
    for (var i = 0; i<items.length; i++) {
      objItems.push(App.Player.createWithClub(items[i], data.clubs));
    }

    this.get('club_players').pushObjects(objItems);

    this.set('showMore', items.length === App.RESULTS_PER_PAGE);
  },

  actions : {
    more : function() {

      var controller = this;

      var players = this.get('club_players'),
          length = players.length;
          lastObject = players[length-1];

      App.IO.getPlayers(
        {
          clu_id:this.get('model').id, 
          after:parseInt(lastObject.code) || 0
        }
      ).then(function(items){
        controller.appendItems(items);
      });      

    }
  }
});

App.PlayersRoute = Ember.Route.extend({
  model: function () {
  },
  setupController: function(controller, model) {
    controller.set('players', Ember.A());

    App.IO.getPlayers().then(function(data){
      controller.appendPlayers(data);
    });
  }
});

App.PlayersController = Ember.ObjectController.extend({  
  players: Ember.A(),
  showMorePlayers: true,

  appendPlayers: function(data) {
    var items = data.players;
    var objItems = [];
    for (var i = 0; i<items.length; i++) {
      objItems.push(App.Player.createWithClub(items[i], data.clubs));
    }

    this.get('players').pushObjects(objItems);
    this.set('showMorePlayers', items.length === App.RESULTS_PER_PAGE);
  },

  actions: {
    more : function() {
      var players = this.get('players');

      var length = players.length;
      var lastObject = players[length-1];
      var controller = this;

      App.IO.getPlayers({after: parseInt(lastObject.code) || 0}).then(function(data){
        controller.appendPlayers(data, true);
      });

    }
  }
});

App.PlayerDetailsRoute = Ember.Route.extend({
  model: function(params){
    return App.Player.loadFromIO(params.player_id);
  },
  setupController: function(controller, player) {
    controller.set('model', player);
  }
});

Ember.Handlebars.helper('publicDate', function(value, options) {
    if (!value)
      return '-';

    var parts = value.split('-');
    if (parts.length!=3)
      return value;

    return parts[1] + '/' + parts[0];
});
/*global Ember, DS */

var App = window.App = Ember.Application.create({
	LOG_TRANSITIONS: true
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

DS.RESTAdapter.reopen({
  namespace: 'api/v1'
});

DS.RESTSerializer.reopen({
  keyForBelongsTo: function(type, name) {
    if (type==App.Player && name=='club')
      return 'clu_id';

    var key = this.keyForAttributeName(type, name);

    if (this.embeddedType(type, name)) {
      return key;
    }

    return key + "_id";
  }
});

/*App.Router.reopen({
  location: 'history'
});*/

App.Store = DS.Store.extend({});

App.Club = DS.Model.extend({
  code: DS.attr('string'),
  name: DS.attr('string'),

	players: DS.hasMany('App.Player')
});

App.Player = DS.Model.extend({
  code: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  fathername: DS.attr('string'),
  mothername: DS.attr('string'),
  birthdate: DS.attr('string'),
  rating: DS.attr('number'),

  club: DS.belongsTo('App.Club'),

	fullname: function() {
		return this.get('lastname') + ' ' + this.get('firstname');
	}.property('lastname', 'firstname')
	
}
);

App.IndexController = Ember.ObjectController.extend({

  searchTerm: '',

  searchTermDidChange: Ember.observer(function(controller, prop) {
    console.log('changed', arguments);
    /*this.notifyPropertyChange('clubs');
    this.notifyPropertyChange('players');*/
    this.set('clubs', App.Club.find({q:this.searchTerm}) );
    this.set('players', App.Player.find({q:this.searchTerm}) );
  }, 'searchTerm'),

  clubs: null,

  players: null

});

App.IndexRoute = Ember.Route.extend({
  model: function () {
    return {
    };	
  }
});

App.ClubsRoute = Ember.Route.extend({
	model: function() {
		return App.Club.find();
	}
});

App.ClubDetailsRoute = Ember.Route.extend({
  model: function (params) {
    return App.Club.find(params.club_id);
  },
  setupController: function(controller, club) {
    controller.set('model', club);
    controller.set('club_players', App.Player.query({clu_id:club.id}));
  }
});

App.PlayersRoute = Ember.Route.extend({
  model: function () {
    return App.Player.find();
  }
});

App.PlayerDetailsRoute = Ember.Route.extend({
  model: function (params) {
    return App.Player.find(params.player_id);
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
/*global Ember, DS */

var App = window.App = Ember.Application.create();

/* Order and include as you please. */
// require('scripts/routes/*');
// require('scripts/controllers/*');
// require('scripts/models/*');
// require('scripts/views/*');

App.Router.map(function () {
  this.resource( 'index', { path: '/' } );

  this.resource( 'clubs');
  this.resource( 'players');
});

App.Store = DS.Store.extend({
});

App.IndexRoute = Ember.Route.extend({
  model: function () {
    return [
	];
  }
});

App.ClubsRoute = Ember.Route.extend({
  model: function () {
    return {"clubs": [
            {"id":429,"code":"00101","name":"ΠΑΝΑΘΗΝΑΙΚΟΣ ΑΟ"},
            {"id":430,"code":"00102","name":"ΣΟ ΗΛΙΟΥΠΟΛΗΣ"},
            {"id":431,"code":"00103","name":"ΣΟ ΚΑΛΛΙΘΕΑΣ"},
            {"id":432,"code":"00104","name":"ΠΑΝΕΛΛΗΝΙΟΣ ΓΣ"},
            {"id":433,"code":"00105","name":"ΕΦΕΤ"},
            {"id":434,"code":"00106","name":"ΠΕΙΡΑΙΚΟΣ ΟΣ"},
            {"id":435,"code":"00107","name":"ΣΟ ΑΜΠΕΛΟΚΗΠΩΝ"},
            {"id":436,"code":"00108","name":"ΓΝΟ \"ΑΡΗΣ\" ΝΙΚΑΙΑΣ"},
            {"id":437,"code":"00109","name":"ΣΟ ΑΓΙΑΣ  ΒΑΡΒΑΡΑΣ"},
            {"id":438,"code":"00110","name":"ΣΟ ΠΑΓΚΡΑΤΙΟΥ"}
        ]};
  }
});

App.PlayersRoute = Ember.Route.extend({
  model: function () {
    return {"players": [
        {"id":113291,"code":"00001","firstname":"ΓΕΩΡΓΙΟΣ","lastname":"ΠΑΠΑΝΙΚΟΛΑΟΥ","fathername":"ΑΘΑΝΑΣΙΟΣ","mothername":"ΓΕΩΡΓΙΑ","birthdate":"1950-12-31","rating":1340,"clu_id":610},
        {"id":109799,"code":"00002","firstname":"ΠΑΥΛΟΣ","lastname":"ΜΟΝΑΝΤΕΡΟΣ","fathername":"ΧΑΡΑΛΑΜΠΟΣ","mothername":"ΑΙΚΑΤΕΡΙΝΗ","birthdate":"1936-12-31","rating":1830,"clu_id":610},
        {"id":113438,"code":"00003","firstname":"ΧΡΗΣΤΟΣ","lastname":"ΠΑΠΑΦΩΤΟΠΟΥΛΟΣ","fathername":"ΠΕΡΙΚΛΗΣ","mothername":"ΑΝΑΣΤΑΣΙΑ","birthdate":"1956-12-31","rating":1755,"clu_id":610},
        {"id":105794,"code":"00004","firstname":"ΣΤΑΥΡΟΣ","lastname":"ΚΟΝΤΟΣ","fathername":"ΒΑΣΙΛΕΙΟΣ","mothername":"ΒΑΣΙΛΙΚΗ","birthdate":"1951-12-31","rating":1660,"clu_id":610},
        {"id":103000,"code":"00005","firstname":"ΜΙΛΤΙΑΔΗΣ","lastname":"ΙΩΑΝΝΙΔΗΣ","fathername":"ΙΩΣΗΦ","mothername":"ΚΥΡΙΑΚΗ","birthdate":null,"rating":1785,"clu_id":504},
        {"id":104425,"code":"00006","firstname":"ΣΤΕΦΑΝΟΣ","lastname":"ΚΑΡΒΟΥΝΗΣ","fathername":"ΓΕΩΡΓΙΟΣ","mothername":"ΕΥΑΓΓΕΛΙΑ","birthdate":"1958-12-31","rating":1000,"clu_id":504},
        {"id":99999,"code":"00007","firstname":"ΙΩΑΝΝΗΣ","lastname":"ΓΙΑΝΝΑΚΟΥΛΗΣ","fathername":"ΑΘΑΝΑΣΙΟΣ","mothername":"ΧΡΥΣΑΝΘΗ","birthdate":"1959-12-31","rating":1000,"clu_id":504},
        {"id":113849,"code":"00008","firstname":"ΣΤΕΡΓΙΟΣ","lastname":"ΠΑΥΛΙΔΗΣ","fathername":"ΒΑΣΙΛΕΙΟΣ","mothername":"ΔΗΜΗΤΡΟΥΛΑ","birthdate":"1958-12-31","rating":1660,"clu_id":504},
        {"id":106792,"code":"00009","firstname":"ΣΑΒΒΑΣ","lastname":"ΚΡΟΥΚΛΙΔΗΣ","fathername":"ΑΝΔΡΕΑΣ","mothername":"ΘΕΟΔΩΡΑ","birthdate":"1958-12-31","rating":1300,"clu_id":504},
        {"id":118322,"code":"00010","firstname":"ΠΑΥΛΟΣ","lastname":"ΤΣΑΤΡΑΦΥΛΛΙΑΣ","fathername":"ΠΑΝΑΓΙΩΤΗΣ","mothername":"ΣΟΦΙΑ","birthdate":"1951-12-31","rating":2035,"clu_id":504}
    ]};
  }
});

eso-node
========

A node + ember.js app for browsing / searching greek chess players.


Database
--------

In a postgres instance, create a db named `eso` owned by user `eso` with password `eso`! Then import the tables found at [chessfed-gr/eso-data](http://github.com/chessfed-gr/eso-data).


Installation
------------

You'll need to have [nodejs](http://nodejs.org/), [npm](http://nodejs.org/download/), [grunt](http://gruntjs.com/) and [bower](http://bower.io/) installed, then:

* Clone this project
* Run `npm install` to download all the server-side dependencies
* Run `bower install` to download all client-side javascript


Development
-----------

Run `grunt server`. This will open up a browser with the app and live reload it on change.


Production
----------

* Run `grunt` or `grunt build` to build the distributable version (use --force to get past some jshint warnings and if you want, contribute the fixes!)
* Run `NODE_ENV=production node app.js`
* Visit [localhost:3000](http://localhost:3000)

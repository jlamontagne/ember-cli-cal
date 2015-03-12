/* jshint node: true */
'use strict';
module.exports = {
    name: 'ember-cli-cal',
    included: function(app) {
        this._super.included(app);

        app.import(app.bowerDirectory + '/moment/moment.js');
        app.import('vendor/ember-cli-cal.css');
    }
};

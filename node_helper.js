'use strict';

/* MagicMirror²
 * Module: MMM-OpenSprinkler
 *
 * Originally By Adrian Chrysanthou
 * Updated by John Cohron
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		this.config = null;
	},

	getData: function() {
		var self = this;
		var myUrl = this.config.apiBase + this.config.apiKey + this.config.apiQuery;
		
		request({ url: myUrl, method: 'GET'
		}, function (error, response, body) {

		self.sendSocketNotification("DATA", body);
		});

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG' && self.started == false) {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
			self.started = true;
		}
	}
});

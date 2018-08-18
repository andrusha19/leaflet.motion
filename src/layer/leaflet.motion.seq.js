/**
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Igor Vladyka <igor.vladyka@gmail.com> (https://github.com/Igor-Vladyka/leaflet.motion)
**/

L.Motion.Seq = L.Motion.Group.extend ({
    initialize: function (motion, options) {
        L.Motion.Group.prototype.initialize.call(this, [motion], options);
    },

	nextMotion: function(motion) {
		var prevMotion = this.getLastLayer();
		if (motion instanceof L.Motion.Move) {
			motion = L.motion.polyline(motion.points, motion.options);
		}

		this.addLayer(motion);

		if (prevMotion) {
			this._setupDelay(prevMotion, motion)
		}

		motion.on(L.Motion.Event.SeqSection, this);

		return this;
	},

	startMotion: function () {
		var layer = this.getFirstLayer();
		if (layer) {
			this.fire(L.Motion.Event.SeqStarted, this);
			layer.startMotion();
		}
	},

	getFirstLayer: function() {
		var allLayers = this.getLayers();
		return allLayers.length ? allLayers[0] : null;
	},

	getLastLayer: function() {
		var allLayers = this.getLayers();
		return allLayers.length ? allLayers[allLayers.length - 1]: null;
	},

	_setupDelay: function (currentLayer, nextLayer) {
		currentLayer.on(L.Motion.Event.Ended, function(e){
			 nextLayer.startMotion();
		});
	}
});

L.motion.seq = function(motion, options){
	if (motion.length) {
		motion = motion[0];
	}
    return new L.Motion.Seq(motion, options);
};
"use strict";
var Player = (function () {
    function Player(options) {
        this.collection = [];
        this.currentPack = {};
        this.id = null;
        this.id = options.id;
    }
    Player.prototype.toJSON = function () {
        return {
            id: this.id,
        };
    };
    return Player;
}());
exports.Player = Player;

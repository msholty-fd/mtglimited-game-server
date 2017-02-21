"use strict";
var Player = (function () {
    function Player(options) {
        this.collection = [];
        this.currentPack = {};
        this.packQueue = [];
        this.id = null;
        this.id = options.id;
    }
    Player.prototype.toJSON = function () {
        return {
            id: this.id,
            collection: this.collection,
            currentPack: this.currentPack,
        };
    };
    return Player;
}());
exports.Player = Player;

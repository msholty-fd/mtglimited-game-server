"use strict";
var lodash_1 = require("lodash");
var BoosterPack = (function () {
    function BoosterPack() {
        this.cards = [];
    }
    BoosterPack.prototype.unpickedCards = function () {
        return lodash_1._.filter(this.cards, function (card) {
            return !card.picked;
        });
    };
    BoosterPack.prototype.toJSON = function () {
        return {
            cards: this.cards,
            set: this.set,
        };
    };
    return BoosterPack;
}());
exports.BoosterPack = BoosterPack;

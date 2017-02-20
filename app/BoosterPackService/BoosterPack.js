"use strict";
var lodash_1 = require("lodash");
var BoosterPack = (function () {
    function BoosterPack() {
        this.cards = [];
        this.cards = [];
    }
    BoosterPack.prototype.unpickedCards = function () {
        return lodash_1.default.filter(this.cards, function (card) {
            return !card.picked;
        });
    };
    return BoosterPack;
}());
exports.BoosterPack = BoosterPack;

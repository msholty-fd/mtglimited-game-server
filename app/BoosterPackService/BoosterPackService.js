"use strict";
var lodash_1 = require("lodash");
var BoosterPack_1 = require("./BoosterPack");
var BoosterPackService = (function () {
    function BoosterPackService() {
        this.sets = [];
    }
    BoosterPackService.prototype.createBoosterPack = function (setAbbr) {
        var _this = this;
        var set = require("../Sets/" + setAbbr)[setAbbr];
        var boosterPack = new BoosterPack_1.BoosterPack();
        boosterPack.set = setAbbr;
        var setGroupedByRarity = lodash_1._.groupBy(set.cards, function (card) { return card.rarity.toLowerCase(); });
        var isMythicPack = this.isMythicRare();
        lodash_1._.forEach(set.booster, function (rarity) {
            var rarityKey = rarity;
            if (lodash_1._.isObject(rarity)) {
                rarityKey = isMythicPack ? 'mythic rare' : 'rare';
            }
            var cardChoices = setGroupedByRarity[rarityKey];
            if (cardChoices) {
                var randomCard = _this.getRandomCard(cardChoices);
                randomCard.setAbbr = setAbbr;
                boosterPack.cards.push(lodash_1._.clone(randomCard));
            }
        });
        return boosterPack;
    };
    // TODO: do not add duplicate cards to a pack unless its a foil
    // Add random foils
    BoosterPackService.prototype.getRandomCard = function (cards) {
        if (cards.length === 0) {
            return {};
        }
        var randomCardIndex = lodash_1._.random(0, cards.length - 1);
        return cards[randomCardIndex];
    };
    BoosterPackService.prototype.isMythicRare = function () {
        // 1 out of 8 chance
        return lodash_1._.random(1, 8) === 1;
    };
    return BoosterPackService;
}());
exports.BoosterPackService = BoosterPackService;

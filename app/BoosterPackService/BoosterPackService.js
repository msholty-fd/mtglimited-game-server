"use strict";
var lodash_1 = require("lodash");
var BoosterPack_1 = require("./BoosterPack");
var BoosterPackService = (function () {
    function BoosterPackService() {
        this.sets = [];
    }
    BoosterPackService.prototype.createBoosterPack = function (setAbbr) {
        var _this = this;
        var set = this.sets[setAbbr];
        var boosterPack = new BoosterPack_1.BoosterPack();
        var setGroupedByRarity = lodash_1.default.groupBy(set.cards, function (card) {
            return lodash_1.default.toLower(card.rarity);
        });
        var isMythicPack = this.isMythicRare();
        lodash_1.default.forEach(set.booster, function (rarity) {
            var rarityKey = rarity;
            if (lodash_1.default.isObject(rarity)) {
                rarityKey = isMythicPack ? 'mythic rare' : 'rare';
            }
            var cardChoices = setGroupedByRarity[rarityKey];
            if (cardChoices) {
                var randomCard = _this.getRandomCard(cardChoices);
                randomCard.setAbbr = setAbbr;
                boosterPack.cards.push(lodash_1.default.clone(randomCard));
            }
        });
        return boosterPack;
    };
    BoosterPackService.prototype.setSet = function (setAbbr, set) {
        this.sets[setAbbr] = set;
    };
    BoosterPackService.prototype.getSet = function (setAbbr) {
        return this.sets[setAbbr];
    };
    // TODO: do not add duplicate cards to a pack unless its a foil
    // Add random foils
    BoosterPackService.prototype.getRandomCard = function (cards) {
        if (cards.length === 0) {
            return {};
        }
        var randomCardIndex = lodash_1.default.random(0, cards.length - 1);
        return cards[randomCardIndex];
    };
    BoosterPackService.prototype.isMythicRare = function () {
        // 1 out of 8 chance
        return lodash_1.default.random(1, 8) === 1;
    };
    return BoosterPackService;
}());
exports.BoosterPackService = BoosterPackService;

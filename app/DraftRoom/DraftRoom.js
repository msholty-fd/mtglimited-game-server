"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var colyseus_1 = require("colyseus");
var Player_1 = require("../Player");
var BoosterPackService_1 = require("../BoosterPackService");
var DraftRoom = (function (_super) {
    __extends(DraftRoom, _super);
    function DraftRoom(options) {
        var _this = _super.call(this, options) || this;
        _this.boosterPackService = new BoosterPackService_1.BoosterPackService();
        _this.passDirections = [-1, 1, -1];
        _this.passDirectionIndex = 0;
        _this.setPatchRate(1000);
        _this.setState({
            messages: [],
            players: [],
            isDraftStarted: false,
            activeSet: 'KLD',
            packDoneCount: 0,
        });
        console.log("ChatRoom created!", options);
        return _this;
    }
    DraftRoom.prototype.requestJoin = function (options) {
        return this.clients.length < this.options.maxClients;
    };
    DraftRoom.prototype.onJoin = function (client) {
        this.state.messages.push(client.id + " joined.");
        var newPlayer = new Player_1.Player({
            id: client.id,
        });
        this.state.players.push(newPlayer);
    };
    DraftRoom.prototype.onLeave = function (client) {
        this.state.messages.push(client.id + " left.");
        delete this.state.players[client.id];
    };
    DraftRoom.prototype.onMessage = function (client, data) {
        if (data.message) {
            this.state.messages.push(data.message);
        }
        if (data.type === 'startDraft') {
            this.startDraft();
        }
        if (data.type === 'pickCard') {
            this.pickCard(client.id, data);
            this.passPack(client.id, data);
            if (this.state.packDoneCount === this.state.players.length) {
                console.log('refreshing packs');
                this.passDirectionIndex++;
                this.refreshBoosters();
            }
        }
    };
    DraftRoom.prototype.pickCard = function (playerId, data) {
        var playerIndex = this.state.players.findIndex(function (player) { return player.id === playerId; });
        var player = this.state.players[playerIndex];
        var card = player.currentPack.cards[data.cardIndex];
        // Put the card in the player's collection
        card.isPicked = true;
        player.collection.push(card);
        console.log('unpicked cards: ', player.currentPack.unpickedCards());
        if (player.currentPack.unpickedCards().length === 0) {
            this.state.packDoneCount++;
            console.log('incremented packDoneCount', this.state.packDoneCount);
        }
    };
    DraftRoom.prototype.passPack = function (playerId, data) {
        var playerIndex = this.state.players.findIndex(function (player) { return player.id === playerId; });
        var player = this.state.players[playerIndex];
        var passTargetIndex = playerIndex + this.passDirections[this.passDirectionIndex];
        if (passTargetIndex > this.state.players.length - 1) {
            passTargetIndex = 0;
        }
        else if (passTargetIndex < 0) {
            passTargetIndex = this.state.players.length - 1;
        }
        var passTarget = this.state.players[passTargetIndex];
        passTarget.packQueue.push(player.currentPack);
        if (player.packQueue.length) {
            player.currentPack = player.packQueue.splice(0, 1)[0];
        }
        else {
            player.currentPack = null;
        }
        this.nudgeNeighbor(passTarget);
    };
    DraftRoom.prototype.startDraft = function () {
        this.state.isDraftStarted = true;
        this.refreshBoosters();
    };
    DraftRoom.prototype.nudgeNeighbor = function (passTarget) {
        if (!passTarget.currentPack) {
            passTarget.currentPack = passTarget.packQueue.splice(0, 1)[0];
        }
    };
    DraftRoom.prototype.refreshBoosters = function () {
        var _this = this;
        this.state.packDoneCount = 0;
        this.state.players.forEach(function (player, index) {
            var boosterPack = _this.boosterPackService.createBoosterPack(_this.state.activeSet);
            _this.state.players[index].currentPack = boosterPack;
        });
    };
    DraftRoom.prototype.onDispose = function () {
        console.log("Dispose ChatRoom");
    };
    return DraftRoom;
}(colyseus_1.Room));
exports.DraftRoom = DraftRoom;

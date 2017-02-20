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
        _this.setPatchRate(1000);
        _this.setState({
            messages: [],
            players: [],
            isDraftStarted: false,
            activeSet: 'KLD',
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
        console.log(client.id, "joined!");
    };
    DraftRoom.prototype.onLeave = function (client) {
        this.state.messages.push(client.id + " left.");
        delete this.state.players[client.id];
        console.log(this.clients);
    };
    DraftRoom.prototype.onMessage = function (client, data) {
        if (data.message) {
            this.state.messages.push(data.message);
        }
        if (data.type === 'startDraft') {
            this.startDraft();
        }
        console.log("DraftRoom:", client.id, data);
        console.log(this.state);
    };
    DraftRoom.prototype.startDraft = function () {
        var _this = this;
        // loop through each player
        // Generate a pack
        // give pack to player
        this.state.isDraftStarted = true;
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

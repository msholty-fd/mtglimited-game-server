"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var colyseus_1 = require("colyseus");
var Player_1 = require("../Player");
var DraftRoom = (function (_super) {
    __extends(DraftRoom, _super);
    function DraftRoom(options) {
        var _this = _super.call(this, options) || this;
        _this.setPatchRate(1000);
        _this.setState({
            messages: [],
            players: {},
            isDraftStarted: false,
        });
        console.log("ChatRoom created!", options);
        return _this;
    }
    DraftRoom.prototype.requestJoin = function (options) {
        return this.clients.length < this.options.maxClients;
    };
    DraftRoom.prototype.onJoin = function (client) {
        this.state.messages.push(client.id + " joined.");
        this.state.players[client.id] = new Player_1.Player({
            id: client.id,
        });
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
        this.state.isDraftStarted = !!data.isDraftStarted;
        if (this.state.isDraftStarted) {
            this.startDraft();
        }
        console.log("DraftRoom:", client.id, data);
        console.log(this.state);
    };
    DraftRoom.prototype.startDraft = function () {
        // loop through each player
        // Generate a pack
        // give pack to player
    };
    DraftRoom.prototype.onDispose = function () {
        console.log("Dispose ChatRoom");
    };
    return DraftRoom;
}(colyseus_1.Room));
exports.DraftRoom = DraftRoom;

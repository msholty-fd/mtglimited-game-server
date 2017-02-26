import { Room } from 'colyseus';
import { Player } from '../Player';
import { BoosterPackService } from '../BoosterPackService';

const LEFT = -1;
const RIGHT = 1;

export class DraftRoom extends Room < any > {
  boosterPackService = new BoosterPackService();
  passDirections = [LEFT, RIGHT, LEFT];
  passDirectionIndex = 0;

  constructor(options) {
    super(options);
    this.setPatchRate(1000);
    this.setState({
      messages: [],
      players: [],
      isDraftActive: false,
      activeSet: 'KLD',
      packDoneCount: 0,
      currentPackNumber: 0,
    });
    console.log("ChatRoom created!", options);
  }

  requestJoin(options) {
    return this.clients.length < this.options.maxClients;
  }

  onJoin(client) {
    this.state.messages.push(`${ client.id } joined.`);
    const newPlayer = new Player({
      id: client.id,
    });

    this.state.players.push(newPlayer);
  }

  onLeave(client) {
    this.state.messages.push(`${ client.id } left.`);
    delete this.state.players[client.id];
  }

  onMessage(client, data) {
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
  }

  pickCard(playerId, data) {
    const playerIndex = this.state.players.findIndex(player => player.id === playerId);
    const player = this.state.players[playerIndex];
    const card = player.currentPack.cards[data.cardIndex];

    card.isPicked = true;
    player.collection.push(card);

    if (player.currentPack.unpickedCards().length === 0) {
      this.state.packDoneCount++;
    }
  }

  passPack(playerId, data) {
    const playerIndex = this.state.players.findIndex(player => player.id === playerId);
    const player = this.state.players[playerIndex];

    let passTargetIndex = playerIndex + this.passDirections[this.passDirectionIndex];
    if (passTargetIndex > this.state.players.length - 1) {
      passTargetIndex = 0;
    } else if (passTargetIndex < 0) {
      passTargetIndex = this.state.players.length - 1;
    }

    const passTarget = this.state.players[passTargetIndex];
    passTarget.packQueue.push(player.currentPack);

    if (player.packQueue.length) {
      player.currentPack = player.packQueue.splice(0, 1)[0];
    } else {
      player.currentPack = null;
    }

    this.nudgeNeighbor(passTarget);
  }

  startDraft() {
    this.state.isDraftActive = true;
    this.refreshBoosters();
  }

  nudgeNeighbor(passTarget) {
    if (!passTarget.currentPack) {
      passTarget.currentPack = passTarget.packQueue.splice(0, 1)[0];
    }
  }

  refreshBoosters() {
    this.state.packDoneCount = 0;
    this.state.currentPackNumber++;

    if (this.state.currentPackNumber > 3) {
      this.endDraft();
    } else {
      this.state.players.forEach((player, index) => {
        const boosterPack = this.boosterPackService.createBoosterPack(this.state.activeSet);
        this.state.players[index].currentPack = boosterPack;
      });
    }
  }

  endDraft() {
    this.state.isDraftActive = false;
  }

  onDispose() {
    console.log("Dispose ChatRoom");
  }
}

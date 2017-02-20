import { Room } from 'colyseus';
import { Player } from '../Player';
import { BoosterPackService } from '../BoosterPackService';

export class DraftRoom extends Room < any > {
  boosterPackService = new BoosterPackService();

  constructor(options) {
    super(options);
    this.setPatchRate(1000);
    this.setState({
      messages: [],
      players: [],
      isDraftStarted: false,
      activeSet: 'KLD',
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
    console.log(client.id, "joined!");
  }

  onLeave(client) {
    this.state.messages.push(`${ client.id } left.`);
    delete this.state.players[client.id];
    console.log(this.clients);
  }

  onMessage(client, data) {
    if (data.message) {
      this.state.messages.push(data.message);
    }

    if (data.type === 'startDraft') {
      this.startDraft();
    }

    console.log("DraftRoom:", client.id, data);
    console.log(this.state);
  }

  startDraft() {
    // loop through each player
    // Generate a pack
    // give pack to player
    this.state.isDraftStarted = true;
    this.state.players.forEach((player, index) => {
      const boosterPack = this.boosterPackService.createBoosterPack(this.state.activeSet);
      this.state.players[index].currentPack = boosterPack;
    });
  }

  onDispose() {
    console.log("Dispose ChatRoom");
  }
}

import { _ } from 'lodash';

export class BoosterPack {
  cards = [];
  set: null;

  unpickedCards() {
    return _.filter(this.cards, card => !card.isPicked);
  }

  toJSON() {
    return {
      cards: this.cards,
      set: this.set,
    };
  }
}

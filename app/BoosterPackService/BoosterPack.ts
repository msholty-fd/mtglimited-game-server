import _ from 'lodash';

export class BoosterPack {
  cards = [];

  constructor() {
    this.cards = [];
  }

  unpickedCards() {
    return _.filter(this.cards, (card) => {
      return !card.picked;
    });
  }
}

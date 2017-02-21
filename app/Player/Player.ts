export class Player {
  collection = [];
  currentPack = {};
  packQueue = [];
  id = null;

  constructor(options) {
    this.id = options.id;
  }

  toJSON() {
    return {
      id: this.id,
      collection: this.collection,
      currentPack: this.currentPack,
    };
  }
}

export class Player {
  collection = [];
  currentPack = {};
  id = null;

  constructor(options) {
    this.id = options.id;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}

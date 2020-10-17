import { Console } from '../libs';
import { NotImplementedError } from '../errors';

export class LevelingManager {

  private _user;

  static fromJson(data: Object): LevelingManager {
    const levelingManager = Object.assign(new LevelingManager, data);
    throw new NotImplementedError();
    return levelingManager;
  }

  levelUp() {
    throw new NotImplementedError();
  }

  increaseStat() {
    throw new NotImplementedError();
  }

  randomizeStat() {
    throw new NotImplementedError();
  }
}

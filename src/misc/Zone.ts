import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Rect } from '../classes';
import { SpawnData } from './SpawnData';
import { randomPercent } from '../utils';

export class Zone {

  private _rect: Rect;
  private _id: number;
  private _spawnData: SpawnData[];

  static fromJson(data: Object): Zone {
    const zone = Object.assign(new Zone, data);
    throw new NotImplementedError();
    return zone;
  }

  constructor(rect?: Rect, id?: number, spawnData?: SpawnData[]) {
    this._rect = rect;
    this._id = id;
    this._spawnData = spawnData;
  }

  getSpawn(): SpawnData | null {
    let percent = 0;
    const random = randomPercent();

    for (const spawnData of this._spawnData) {
      if (random <= (percent += spawnData.percent())) {
        return spawnData;
      }
    }
  }
}

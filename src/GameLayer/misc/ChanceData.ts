import { IChanceData } from '../types';
import { LiteralObject } from '../../types';
import { randomPercent } from '../utils';

export class ChanceData<T> {

  //#region properties
  private _chanceData: IChanceData<T>[] = [];
  //#endregion

  constructor(chanceData:  IChanceData<T>[] = []) {
    this._chanceData = chanceData;
  }

  //#region static methods
  static fromJson<T>(data: LiteralObject): ChanceData<T> {
    if (!data) {
      return;
    }

    const chanceData = new ChanceData<T>(data.chanceData);
    return chanceData;
  }
  //#endregion

  //#region functions
  getData = (): T => {
    let percent = 0;
    const random = randomPercent();
    const chanceDataList = this.chanceData()
      .slice()
      // we need to process the lowest chances first and the greatest chances last
      .sort((a, b) => a.chance - b.chance);

    for (const chanceData of chanceDataList) {
      if (random <= (percent += chanceData.chance)) {
        return chanceData.data;
      }
    }
  }
  //#endregion

  //#region accessors
  chanceData(): IChanceData<T>[] {
    return this._chanceData;
  }

  setChanceData(chanceData: IChanceData<T>[]): this {
    this._chanceData = chanceData ?? [];
    return this;
  }
  //#endregion
}

import { LiteralObject } from '../types';
import { Rect } from '../GameLayer/classes';

export class ZonesData {

  //#region static properties
  private static _instance: ZonesData;
  //#endregion

  //#region properties
  private _zonesData: ZoneData[];
  private _isInitialized: boolean = false;
  //#endregion

  private constructor() {}

  //#region functions
  init = (zones: LiteralObject[]): this => {
    const zonesData: ZoneData[] = [];

    for (const zone of zones) {
      zonesData.push({
        rect: Rect.fromJson(zone.rect),
        id: zone.id,
      });
    }

    this.setZonesData(zonesData).setIsInitialized(true);

    return this;
  }

  findByCoords = (x: number, y: number): number => {
    const zoneData = this
      .zonesData()
      .find(zoneData => zoneData.rect.isWithin(x, y));

    return zoneData?.id;
  }
  //#endregion

  //#region static accessors
  static get(): ZonesData {
    return ZonesData._instance ??= new ZonesData();
  }
  //#endregion

  //#region accessors
  zonesData(): ZoneData[] {
    return this._zonesData;
  }

  private setZonesData(zonesData: ZoneData[]): this {
    this._zonesData = zonesData;
    return this;
  }

  isInitialized(): boolean {
    return this._isInitialized;
  }

  private setIsInitialized(isInitialized: boolean): this {
    this._isInitialized = isInitialized;
    return this;
  }
  //#endregion
}

interface ZoneData {
  rect: Rect;
  id: number;
}

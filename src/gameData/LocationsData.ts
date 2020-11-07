import { LiteralObject } from '../types';

export class LocationsData {

  //#region static properties
  private static _instance: LocationsData;
  //#endregion

  //#region properties
  private _coordsData: ILocationsCoordsXData;
  private _isInitialized: boolean = false;
  //#endregion

  private constructor() {}

  //#region functions
  init = (locations: LiteralObject[]): this => {
    const coordsData = {};

    for (const location of locations) {
      coordsData[location.coords.x] = {
        [location.coords.y]: location.id,
      };
    }

    this.setCoordsData(coordsData).setIsInitialized(true);

    return this;
  }

  findByCoords = (x: number, y: number): number => {
    return this.coordsData()[x]?.[y];
  }
  //#endregion

  //#region static accessors
  static get(): LocationsData {
    return LocationsData._instance ??= new LocationsData();
  }
  //#endregion

  //#region accessors
  coordsData(): ILocationsCoordsXData {
    return this._coordsData;
  }

  private setCoordsData(coordsData: ILocationsCoordsXData): this {
    this._coordsData = coordsData;
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

interface ILocationsCoordsXData {
  [key: number]: ILocationsCoordsYData;
}

interface ILocationsCoordsYData {
  [key: number]: number;
}

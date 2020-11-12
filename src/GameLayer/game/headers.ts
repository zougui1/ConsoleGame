import { Console } from '../../libs';
import { Coords } from '../misc';
export const wildernessHeader = (coords: Coords): typeof Console => {
  return Console.cyan.writeLine('x:', coords.x(), 'y:', coords.y());
}

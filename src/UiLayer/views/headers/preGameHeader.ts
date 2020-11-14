import { Renderer } from '../../classes';
import { getCenter } from '../../utils';
import { APP_NAME } from '../../../constants';

export const preGameHeader = (): Renderer => {
  const getCenterX = () => getCenter({ maxWidth: APP_NAME.length }).x;
  return new Renderer(APP_NAME).setOption('x', getCenterX);
}

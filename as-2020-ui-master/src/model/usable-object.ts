import { Point } from '../converters/point';
import { Activity } from './activity';

export interface UsableObject {
  interactiveZone: Array<Point>;
  relatedActivity: Activity;
}

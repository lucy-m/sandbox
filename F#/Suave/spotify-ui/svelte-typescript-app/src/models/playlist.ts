import { ImageModel } from './image';

export interface PlaylistModel {
  id: string;
  name: string;
  images: ImageModel[];
}

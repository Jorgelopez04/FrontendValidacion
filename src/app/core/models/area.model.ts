import { Role } from './role.model';

export interface Area {
  id_area: number;
  name: string;
  roles?: Role[];
}
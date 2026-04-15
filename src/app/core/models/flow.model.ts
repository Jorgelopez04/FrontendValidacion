import { Role } from './role.model';
import { Category } from './category.model';

export interface Flow {
  id_flow: number;
  sequence: number;
  role: Role;
  category: Category;
}

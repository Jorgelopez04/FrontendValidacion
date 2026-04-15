import { Area } from "./area.model";

export interface Role {
  id_role: number;
  name: string;
  description: string;
  area?: Area;
}
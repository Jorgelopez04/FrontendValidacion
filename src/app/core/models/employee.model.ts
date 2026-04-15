import { Role } from "./role.model";
import { Task } from "./task.model";

export interface Employee{
  id_employee: number;
  cc: string;
  name: string;
  state: string;
  role: Role;
  tasks: Task[];
}
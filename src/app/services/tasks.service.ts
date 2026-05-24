import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Task } from '../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getAssignedTasks(): Observable<ResponseDto<Task[]>> {
    return this.http.get<ResponseDto<Task[]>>(`${this.API_URL}/assigned`);
  }

  getTaskById(id: number): Observable<ResponseDto<Task>> {
    return this.http.get<ResponseDto<Task>>(`${this.API_URL}/${id}`);
  }

  startTask(id: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${id}/start`, {});
  }

  completeTask(id: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${id}/complete`, {});
  }

  getProductTasks(id: number): Observable<ResponseDto<Task[]>> {
    return this.http.get<ResponseDto<Task[]>>(`${this.API_URL}/${id}/product-tasks`);
  }

  createTask(task: any): Observable<ResponseDto<Task>> {
    return this.http.post<ResponseDto<Task>>(this.API_URL, task);
  }

  updateCascadingStates(taskId: number, stateUpdate: any): Observable<ResponseDto<Task[]>> {
    return this.http.patch<ResponseDto<Task[]>>(`${this.API_URL}/${taskId}/cascading-states`, stateUpdate);
  }

  assignEmployee(taskId: number, employeeAssignment: any): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${taskId}/assign-employee`, employeeAssignment);
  }

  findAssignedTasks(filters: any): Observable<ResponseDto<Task[]>> {
    return this.http.post<ResponseDto<Task[]>>(`${this.API_URL}/find-assigned`, filters);
  }

  findAll(filters: any): Observable<ResponseDto<Task[]>> {
    return this.http.post<ResponseDto<Task[]>>(`${this.API_URL}/find-all`, filters);
  }

  findById(id: number, filters?: any): Observable<ResponseDto<Task>> {
    return this.http.post<ResponseDto<Task>>(`${this.API_URL}/find-by-id/${id}`, filters || {});
  }

  findPreviousTask(taskId: number): Observable<ResponseDto<Task>> {
    return this.http.get<ResponseDto<Task>>(`${this.API_URL}/find-previous/${taskId}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}`);
  }
}

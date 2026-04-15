import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Flow } from '../core/models/flow.model';

@Injectable({
  providedIn: 'root'
})
export class FlowsService {
  private readonly API_URL = `${environment.apiUrl}/flows`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<Flow[]>> {
    return this.http.get<ResponseDto<Flow[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Flow>> {
    return this.http.get<ResponseDto<Flow>>(`${this.API_URL}/${id}`);
  }

  getByCategory(categoryId: number): Observable<ResponseDto<Flow[]>> {
    return this.http.get<ResponseDto<Flow[]>>(`${this.API_URL}/category/${categoryId}`);
  }

  create(flow: any): Observable<ResponseDto<Flow>> {
    return this.http.post<ResponseDto<Flow>>(this.API_URL, flow);
  }

  update(id: number, flow: any): Observable<ResponseDto<Flow>> {
    return this.http.patch<ResponseDto<Flow>>(`${this.API_URL}/${id}`, flow);
  }
}
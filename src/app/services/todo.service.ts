import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface TodoTask {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = environment.baseUrl + '/api/todo';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<TodoTask[]> {
    return this.http.get<TodoTask[]>(this.baseUrl);
  }

  createTask(title: string, description: string): Observable<TodoTask> {
    return this.http.post<TodoTask>(this.baseUrl, { title, description });
  }

  updateTask(id: number, task: { title: string, description: string, isCompleted: boolean }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

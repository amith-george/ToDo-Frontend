import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl + '/api/auth';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(credentials: any) {
    return this.http.post<{ token: string, user: any }>(`${this.baseUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import User from '../../models/user.model';

@Injectable()
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  public getAllUsers = (): Observable<User[]> => {
    return this.http.get<User[]>(this.apiUrl);
  }

  public getUser = (id: string): Observable<User> => {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  public addUser = (user: User): Observable<User> => {
    return this.http.post<User>(this.apiUrl, user);
  }

  public removeUser = (id: string): Observable<User> => {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  public updateUser = (id: string, user: User): Observable<User> => {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

}

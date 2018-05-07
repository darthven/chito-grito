import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import User from '../../models/user.model';
import { UserState } from '../common/user.state';


@Injectable()
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/api/users';
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private readonly stateSubject: BehaviorSubject<UserState> = new BehaviorSubject<UserState>({
    users: Observable.of([]),
    currentUser: null,
    changed: true
  });

  constructor(private http: HttpClient) { }

  public getAllUsers = (): Observable<User[]> => {
    const state: UserState = this.getState();
    if (state.changed) {
      console.log('Request was made');
      this.stateSubject.next({
        ...state,
        users: this.http.get<User[]>(this.apiUrl, { headers: this.headers }),
        changed: false
      });
    }
    return this.getState().users;
  }

  public getUser = (id: string): Observable<User> => {
    const state: UserState = this.getState();
    this.stateSubject.next({
      ...state,
      currentUser: this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.headers }),
      changed: false
    });
    return this.getState().currentUser;
  }

  public addUser = (user: User): Observable<User> => {
    const state: UserState = this.getState();
    const newUser = this.http.post<User>(this.apiUrl, JSON.stringify(user), { headers: this.headers });
    this.stateSubject.next({
      ...state,
      currentUser: newUser,
      changed: true
    });
    return this.getState().currentUser;
  }

  public removeUser = (id: string): Subscription => {
    const state: UserState = this.getState();
    return this.http.delete<User>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .subscribe((res) => {
        console.log('User was deleted: ', res);
        this.stateSubject.next({
          ...state,
          currentUser: null,
          changed: true
        });
    });
  }

  public updateUser = (id: string, user: User): Observable<User> => {
    const state: UserState = this.getState();
    this.stateSubject.next({
      ...state,
      currentUser: this.http.put<User>(`${this.apiUrl}/${id}`, JSON.stringify(user), { headers: this.headers }),
      changed: true
    });
    return this.getState().currentUser;
  }

  public getState = (): UserState => {
    return this.stateSubject.getValue();
  }

}

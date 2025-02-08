import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';
import { BASE_URL } from '../Api';

const URL = BASE_URL + '/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _usersData:Array<User> = [];
  private _users: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
  public readonly users: Observable<Array<User>> = this._users.asObservable();

  constructor(private http: HttpClient) { 
    this.fetchUsersFromServer();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL); 
  }

  fetchUsersFromServer(): void {
    this.getAllUsers().subscribe(
      (response: User[]) => {
        this._usersData = response.map(item => item);
        this.emitChange();
        // console.log(this._usersData.length)
      }
    );
  }

  private emitChange() {
    this._users.next(this._usersData);
  }
}

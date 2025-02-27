import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
    console.log('users fetching ...')
    this.getAllUsers().subscribe(
      (response: User[]) => {
        this._usersData = response.map(item => item);
        this.emitChange();
        // console.log('users ', this._usersData)
      }
    );
  }

  saveUser(user: User) : Observable<User>{
    this._saveUser(user);
    return this.http.post<User>(URL+'/save',user);
  }

  private _saveUser(user: User){
    this._usersData.push(user);
    this.emitChange();
  }

  getBorrowedUsers(): Observable<User[]> {
    return this.users.pipe(
      map(users => 
        users.filter(user => user.borrowedBooks && user.borrowedBooks.length > 0) 
      )
    );
  }
  

  private emitChange() {
    this._users.next(this._usersData);
  }
}

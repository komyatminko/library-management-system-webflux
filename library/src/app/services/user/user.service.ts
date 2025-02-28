import { Book } from '@/app/models/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { User } from '../../models/user';
import { BASE_URL } from '../Api';
import { BookService } from '../book/book.service';

const URL = BASE_URL + '/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _usersData:Array<User> = [];
  private _users: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
  public readonly users: Observable<Array<User>> = this._users.asObservable();

  constructor(private http: HttpClient, private bookService: BookService) { 
    this.fetchUsersFromServer();

    this.bookService.bookUpdated$.subscribe((updatedBook) => {
  
      this.fetchUsersFromServer();
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL); 
  }

  fetchUsersFromServer(): void {
    this.getAllUsers().subscribe(
      (response: User[]) => {
        this._usersData = response.map(item => item);
        this.emitChange();
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

  updateUser(user:User){
    this.http.put<{data: User}>(URL + '/' + user.id, user).pipe(take(1)).subscribe((res) => {
      this._updateUser(res.data);
    })
  }

  _updateUser(user: User){
    this._usersData = this._usersData.map(oldUser => oldUser.id === user.id ? user : oldUser);
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

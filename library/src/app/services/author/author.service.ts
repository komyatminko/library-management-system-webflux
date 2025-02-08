import { Author } from '@/app/models/author';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from '../Api';

const URL = BASE_URL + '/v1/authors';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private _authorsData:Array<Author> = [];
  private _authors: BehaviorSubject<Array<Author>> = new BehaviorSubject<Array<Author>>([]);
  public readonly authors: Observable<Array<Author>> = this._authors.asObservable();
  
  constructor(private http: HttpClient) {
    this.fetchAuthorsFromServer();
  }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(URL); 
  }

  fetchAuthorsFromServer(): void {
    this.getAllAuthors().subscribe(
      (response: Author[]) => {
        this._authorsData = response.map(item => item);
        this.emitChange();
        
      }
    );
  }

  private emitChange() {
    this._authors.next(this._authorsData);
  }
}

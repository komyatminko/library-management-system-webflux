import { Book } from '@/app/models/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from '../Api';

const URL = BASE_URL + '/v1/books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private _booksData:Array<Book> = [];
  private _books: BehaviorSubject<Array<Book>> = new BehaviorSubject<Array<Book>>([]);
  public readonly books: Observable<Array<Book>> = this._books.asObservable();

  constructor(private http: HttpClient) { 
    this.fetchBooksFromServer();
  }

  getAllBooks(): Observable<{ data: Book }[]> {
    return this.http.get<{ data: Book }[]>(URL + '/findAllBooks'); 
  }

  fetchBooksFromServer(): void {
    this.getAllBooks().subscribe(
      (response: { data: Book }[]) => {
        this._booksData = response.map(item => item.data);
        this.emitChange();
        
      }
    );
  }
  private emitChange() {
    this._books.next(this._booksData);
  }
}

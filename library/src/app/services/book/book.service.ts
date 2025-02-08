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
    return this.http.get<{ data: Book }[]>(URL); 
  }

  fetchBooksFromServer(): void {
    this.getAllBooks().subscribe(
      (response: { data: Book }[]) => {
        this._booksData = response.map(item => item.data);
        this.emitChange();
        
      }
    );
  }

  saveBook(book:Book){
    this.http.post<{data: Book}>(URL+'/save',book).subscribe(res=> {
      // console.log(res.data);
      this._saveBook(res.data);
    });
  }

  _saveBook(book:Book){
    this._booksData.push(book);
    this.emitChange();
  }

  deleteBook(book:Book,callback:()=>void )
  {
    this.http.delete<Book>(URL+"/delete/"+book.id).subscribe(()=>{
      this._deleteBook(book);
      callback();
    });
  }

  _deleteBook(book:Book)
  {
    this._booksData = this._booksData.filter(b=>book.id!=b.id);
    this.emitChange();
  }

  private emitChange() {
    this._books.next(this._booksData);
  }

  //saving book cover img before saving a new book
  //this method return book url
  uploadBookCover(bookCoverFile:File){
    const formData = new FormData();
    formData.append('file', bookCoverFile);
    return this.http.post<{imgUrl: string}>(URL + '/upload/bookCover', formData);
  }
}

import { Book } from '@/app/models/book';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BASE_URL } from '../Api';

const URL = BASE_URL + '/v1/books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  public borrowedBooks: Array<Book> = [];
  private _booksData:Array<Book> = [];
  private _books: BehaviorSubject<Array<Book>> = new BehaviorSubject<Array<Book>>([]);
  public readonly books: Observable<Array<Book>> = this._books.asObservable();

  constructor(private http: HttpClient) { 
    this.fetchBooksFromServer();
  }

  getAllBooks(): Observable<{ data: Book }[]> {
    console.log('get all books ...')
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

  getAllBooksByKeyword(keyword: string):Observable<Book[]>{
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Book[]>(URL + '/find?', {params})
  }

  saveBook(book:Book){
    this.http.post<{data: Book}>(URL+'/save',book).subscribe(res=> {
      this._saveBook(res.data);
    });
  }

  _saveBook(book:Book){
    this._booksData.push(book);
    this.emitChange();
  }

  updateBook(book:Book){
    this.http.put<{data: Book}>(URL + '/' + book.id, book).subscribe((res) => {
      this._updateBook(res.data);
    })
  }

  _updateBook(book: Book){
    this._booksData = this._booksData.map(oldBook => oldBook.id == book.id ? book : oldBook)
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

  deleteBookCover(filePath: string): Observable<void> {
    const params = new HttpParams().set('filePath', filePath);
    console.log(URL + '/delete/bookCover?' + params);
    return this.http.delete<void>(URL + '/delete/bookCover?', { params });
  }

  getBorrowedBooks(): Observable<Book[]> {
    return this.books.pipe(
      map(books => {
        return books.filter(book => (book.borrowedBy?.length || 0) > 0);
      })
    );
  }

  formatDate(timestamp: Date|undefined) {
    if(timestamp){
      const date = new Date(timestamp);
      return date.toISOString().split('T')[0]; // Converts to "YYYY-MM-DD"
    }
    return;
  }
}

import { environment } from '@/app/environment';
import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject, iif, map, Observable, Subject, take } from 'rxjs';
import { BASE_URL } from '../Api';

const URL = BASE_URL + '/v1/books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private overdueRate = environment.overdueFeePerDay; 
  private daysToReturn: number = environment.dayToReturn;
  public borrowedBooks: Array<Book> = [];

  private _booksData:Array<Book> = [];
  private _books: BehaviorSubject<Array<Book>> = new BehaviorSubject<Array<Book>>([]);
  public readonly books: Observable<Array<Book>> = this._books.asObservable();

  private bookUpdatedSubject = new Subject<Book>(); // Subject to notify about book updates
  public readonly bookUpdated$ = this.bookUpdatedSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.fetchBooksFromServer();
  }
  ngOnInit(){
    
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
    this.http.post<{data: Book}>(URL+'/save',book).pipe(take(1)).subscribe(res=> {
      this._saveBook(res.data);
    });
  }

  _saveBook(book:Book){
    this._booksData.push(book);
    this.emitChange();
  }

  updateBook(book:Book){
    this.http.put<{data: Book}>(URL + '/' + book.id, book).pipe(take(1)).subscribe((res) => {
      this._updateBook(res.data);
      this.bookUpdatedSubject.next(res.data);
    })
  }

  _updateBook(book: Book){
    this._booksData = this._booksData.map(oldBook => oldBook.id === book.id ? book : oldBook);
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

  setBorrowedBy(user: any, book: Book | undefined): BorrowedUser{
    // console.log('user before format ', user);
    
    const issueDate = new Date(); // Get the current date
    const returnDate = new Date(issueDate); // Create a copy of currentDate
    returnDate.setDate(returnDate.getDate() + this.daysToReturn);

    let borrowedBy!: BorrowedUser ;
    if(user.id && book){
      borrowedBy = {
        userId: user.id,
        username: user.username,
        issueDate: issueDate,
        returnDate: returnDate,
        isOverdue: false
      }
    }
    return borrowedBy;
  }  

  isOverdue(borrowing: BorrowedUser): boolean{
    let currentDate = new Date();
    let returnDate = borrowing.returnDate;
    return currentDate > returnDate;
  }

  getOverdueFee(daysOverdue: number): number {
    return daysOverdue * this.overdueRate;
  }

  getOverdueDays(returnDateTimestamp: Date): number{
    const currentDate = new Date();
      const returnDate = new Date(returnDateTimestamp);
      return currentDate.getTime() - returnDate?.getTime();
  }

  updateBookWhenOverdue(book: Book, borrowing: BorrowedUser){
    if(book && borrowing){
      if(!borrowing.isOverdue){
        borrowing.isOverdue = true;

        let borrowedBy = book.borrowedBy?.map(user=> user.id == borrowing.id? borrowing : user);
        book.borrowedBy = borrowedBy;
        this.updateBook(book);
      }
    }
  }

  

}
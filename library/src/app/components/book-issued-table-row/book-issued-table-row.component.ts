import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tr[app-book-issued-table-row]',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './book-issued-table-row.component.html',
  styleUrl: './book-issued-table-row.component.css'
})
export class BookIssuedTableRowComponent {
  private _user!: BorrowedUser;


  @Input()
  book!: Book;

  @Input()
  set user(value: BorrowedUser) {
      this._user = value;
  }

  get formattedUser() {
    return {
      id: this._user?.userId || '',
      username: this._user?.username || '',
      issueDate: this.bookService.formatDate(this._user?.issueDate),
      returnDate: this.bookService.formatDate(this._user?.returnDate),
      isOverdue: this._user?.isOverdue || false,
    };
  }



  constructor(private bookService: BookService){}
  
  ngOnInit(){
    // console.log(this.book);
  }

  deleteBookIssued(){
   console.log('borrowed user to be deleted ', this._user);
  }

}

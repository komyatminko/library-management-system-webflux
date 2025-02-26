import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';

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
  hasInjectedButton : boolean = false;
  
  @Input()
  book: Book | undefined;

  @Input()
  set user(value: BorrowedUser) {
      this._user = value;
  }

  get formattedUser() {
    return {
      id: this._user.id,
      userId: this._user?.userId || '',
      username: this._user?.username || '',
      issueDate: this.bookService.formatDate(this._user?.issueDate),
      returnDate: this.bookService.formatDate(this._user?.returnDate),
      isOverdue: this._user?.isOverdue || false,
    };
  }



  constructor(
    private bookService: BookService,
    private elementRef: ElementRef,
    ){}

  ngAfterContentInit() {
    
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[details-btn]');
  }
  
  ngOnInit(){
    
    this.bookService.books.pipe(take(1)).subscribe(books => {
      if(this.book){
        this.book = books.find(book => book.id === this.book?.id);
      }
      
    });


  }

  deleteBookIssued(){
   
    if(this.book){
      
      let borrowedUserToRemove = this.book.borrowedBy?.filter(user=> user.userId != this._user.userId);
      this.book.borrowedBy = borrowedUserToRemove;
      this.bookService.updateBook(this.book);
      
    }
  }

}

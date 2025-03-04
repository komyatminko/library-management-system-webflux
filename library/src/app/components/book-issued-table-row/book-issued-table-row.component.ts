import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { IssuedBookUpdateFormComponent } from '../issued-book-update-form/issued-book-update-form.component';

@Component({
  selector: 'tr[app-book-issued-table-row]',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    IssuedBookUpdateFormComponent
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

  constructor(
    private bookService: BookService,
    private elementRef: ElementRef,
    )
  {

  }

  ngOnInit(){
    this.bookService.books.pipe(take(1)).subscribe(books => {
      if(this.book){
        this.book = books.find(book => book.id === this.book?.id);
      }
      
    }); 

    this.bookService.bookUpdated$.pipe(take(1)).subscribe(updatedBook => {
      updatedBook.borrowedBy?.forEach(bu=> {
        if(bu.userId == this._user.userId){
          this._user.username = bu.username;
        }
      })
    })
  }

  ngAfterContentInit() {
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[details-btn]');
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

  editDialogEvent(user:BorrowedUser)
  {
    this._user = user;
  }

  deleteBookIssued(){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.book){
      
          let borrowedUserToRemove = this.book.borrowedBy?.filter(user=> user.userId != this._user.userId);
          this.book.borrowedBy = borrowedUserToRemove;
          this.bookService.updateBook(this.book).subscribe(data=> this.book = data);
          
        }
      }
    });
  }

}

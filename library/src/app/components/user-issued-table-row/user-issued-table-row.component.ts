import { Book } from '@/app/models/book';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { IssuedUserFormComponent } from '../issued-user-form/issued-user-form.component';

@Component({
  selector: 'tr[app-user-issued-table-row]',
  imports: [
    CommonModule,
    RouterLink,
    IssuedUserFormComponent
  ],
  templateUrl: './user-issued-table-row.component.html',
  styleUrl: './user-issued-table-row.component.css'
})
export class UserIssuedTableRowComponent {

  books!: Book[];
  hasInjectedButton: boolean = false;

  @Input()
  user!: User;

  constructor(
    private elementRef: ElementRef,
    private bookService: BookService,
    ){}

  ngOnInit(){
    this.bookService.books.subscribe(books=> this.books = books);
  }

  ngAfterContentInit() {
    
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[details-btn]');
  }

  showDeleteConfirmDailog(){
    let bookToUpdate!: Book;
    this.books.forEach(book=> {

      if(book.borrowedBy){
       book.borrowedBy.forEach(bu=> {
        if(bu.userId ===  this.user.id){
          bookToUpdate = book;
          bookToUpdate.borrowedBy?.forEach(bu=> {
            let formatBookToUpdate: Book ={
              ...bookToUpdate,
              borrowedBy: bookToUpdate.borrowedBy?.filter(bu=> bu.userId != this.user.id)
            }
            this.deleteIssuedUser(formatBookToUpdate);
          })
        }
       })
      }
    })
  }

  deleteIssuedUser(formatBookToUpdate: Book){
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
        this.bookService.updateBook(formatBookToUpdate).subscribe();
      }
    });
  }
}

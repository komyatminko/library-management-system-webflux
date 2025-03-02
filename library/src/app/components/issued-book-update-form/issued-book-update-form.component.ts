import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-issued-book-update-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './issued-book-update-form.component.html',
  styleUrl: './issued-book-update-form.component.css'
})
export class IssuedBookUpdateFormComponent {

  issuedBookForm!: FormGroup;
  modalDialog!: NgbModalRef;
  books: Book[] = [];

  @Input()
  user!: any;

  @Input()
  book!: Book | undefined;

  @Output()
  onEditClick = new EventEmitter<any>();

  @ViewChild('content', { static: false }) private content:any;
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private bookService: BookService,
  )
  {
      this.issuedBookForm = this.fb.group({
        username: ['', Validators.required],
        uniqueBookId: ['', [Validators.required]],
        issuedDate: ['', Validators.required],
        returnDate: ['', Validators.required],
    });
  }

  ngOnInit(){
    
  }

  showEditDialog(){
    this.patchValueToUpdate();
    this.open(this.content);
  }

  updateIssuedBook(){
    let formData = this.issuedBookForm.value;

    //format book to update
    if(this.book){
      if(formData.uniqueBookId == this.book?.uniqueBookId){

        let bookToUpdate: Book ={
          ...this.book,
          borrowedBy: this.book?.borrowedBy?.map(bu=> {
            return bu.userId == this.user.userId ? {
              id: bu.id,
              userId: bu.userId,
              username: formData.username,
              issueDate: formData.issuedDate,
              returnDate: formData.returnDate,
              isOverdue: this.bookService.isOverdue(formData.returnDate)
            } : bu;
          })
        }
        this.bookService.updateBook(bookToUpdate).subscribe();
      } 
      else if(formData.uniqueBookId != this.book?.uniqueBookId){
  
        this.bookService.books.pipe(take(1)).subscribe((books: Book[])=> this.books = books);
        let bookToAddBorrowedUser = this.books.find(book=> book.uniqueBookId == formData.uniqueBookId.trim());
  
        let bookRemovedBorrowedUser = {
          ...this.book,
          borrowedBy: this.book?.borrowedBy?.filter(bu => bu.userId != this.user.userId)
        }
        console.log('book to update after removing borrowed user', bookRemovedBorrowedUser);
        
       bookToAddBorrowedUser?.borrowedBy?.push({
          id: this.user.id,
          userId: this.user.userId,
          username: formData.username,
          issueDate: formData.issuedDate,
          returnDate: formData.returnDate,
          isOverdue: this.bookService.isOverdue(formData.returnDate)
       })
  
       console.log('book after add borrowed user', bookToAddBorrowedUser);
       if(bookRemovedBorrowedUser && bookToAddBorrowedUser){
        forkJoin([
          this.bookService.updateBook(bookRemovedBorrowedUser),
          this.bookService.updateBook(bookToAddBorrowedUser)
        ]).subscribe({
          next: ([updatedBook1, updatedBook2]) => {
            console.log('Both books updated successfully');
          },
          error: (err) => {
            console.error('One of the updates failed, so both are considered failed:', err);
          }
        });
       }
       
      }
    }
    this.modalDialog.close();
  }

  patchValueToUpdate(){
    this.issuedBookForm.patchValue({
      username : this.user.username,
      uniqueBookId: this.book?.uniqueBookId,
      issuedDate: this.user.issueDate,
      returnDate: this.user.returnDate
    })
  }

  formatBookToUpdate(data: any){

  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

}

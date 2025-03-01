import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-issued-book-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './issued-book-form.component.html',
  styleUrl: './issued-book-form.component.css'
})
export class IssuedBookFormComponent {

  issuedBookForm!: FormGroup;
  modalDialog!: NgbModalRef;
  userType: string = 'existing';
  existingUsers: User[] = [];
  saveFlag: boolean = true;
  hasInjectedButton: boolean = false;

  
  @ViewChild('content', { static: false }) private content:any;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private elementRef: ElementRef,
              private userService: UserService,
              private bookService: BookService) 
  {

    this.issuedBookForm = this.fb.group({
      userType: ['existing'], // Radio button selection
      existingUser: [null], // Holds the selected existing author
      newUser: this.fb.group({
        username: ['', Validators.required],
        phone: ['', [Validators.required, Validators.maxLength(9)]],
        address: ['', Validators.required]
      }),
      uniqueBookId: ['', [Validators.required, Validators.minLength(5)]]
    });

  }

  ngOnInit(){
    this.userService.users.subscribe(users=>{
      this.existingUsers = users;
    })
  }

  ngAfterContentInit() {
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[add-issued-book]');
  }

  openDialogForNew(){
    this.open(this.content);
    this.resetFormIfDismiss();
  }

  updateUserType(type: string){
    this.userType = type;
  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }


  save(){
      let formData = this.issuedBookForm.value;
    let issuedBook: Book | undefined;
    
    

    if(this.userType == 'new'){
      let userToSave = this.formatUserToSave(formData);
      forkJoin({
        savedUser: this.userService.saveUser(userToSave), 
        books: this.bookService.books.pipe(take(1)) 
      }).subscribe(({ savedUser, books }) => {
        issuedBook = books.find(book => book.uniqueBookId === formData.uniqueBookId.trim());
        if(issuedBook){
          this.formatBookWithBorrowedUserAndUpdate(issuedBook, savedUser, formData);
        }
  
        
      });
    }
    else if(this.userType == 'existing'){
      let user = this.existingUsers.find(user=> user.id == formData.existingUser)
      // console.log('borrowed user ', user);
      this.bookService.books.pipe(take(1)).subscribe(books=>{
        // console.log('books ', books)
        issuedBook = books.find(book => book.uniqueBookId === formData.uniqueBookId.trim());
        // console.log('issued book befor pushing borrowed user ', issuedBook);
        if(issuedBook){
          this.formatBookWithBorrowedUserAndUpdate(issuedBook, user, formData);
        }
      })
    }
    this.saveFlag =false;
    this.issuedBookForm.reset({userType: 'existing'});
    this.modalDialog.close();
    
  }

  

  formatUserToSave(formData: any){
    return {
      username: formData.newUser.username,
      password: '',
      email: '',
      roles: [ 
        {
          role: 'USER',
          authority: 'USER'
        }
      ],
      phone: formData.newUser.phone,
      address: formData.newUser.address,
    }
  }

  formatBookWithBorrowedUserAndUpdate(issuedBook: Book, savedUser: any,formData: any) {
    let borrowedUser: BorrowedUser;
    
    borrowedUser = this.bookService.setBorrowedBy(savedUser, issuedBook);
    

    if (issuedBook) {
      if (!issuedBook.borrowedBy) {
        issuedBook.borrowedBy = [];
      }
 

      const userExists = issuedBook.borrowedBy.some(user => user.userId === borrowedUser.userId);

      if (!userExists) {
        let flag = true;
        issuedBook.borrowedBy.push(borrowedUser);
        console.log('issued book to update ', issuedBook);
        this.bookService.updateBook(issuedBook);
        
      }
    } else {
      console.warn('No matching book found!');
    }
  }

  resetFormIfDismiss(){
    this.modalDialog.dismissed.subscribe(()=>{
      this.issuedBookForm.reset();
    })
  }
}

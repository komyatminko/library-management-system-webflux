import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
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

  daysToReturn: number = 5;
  @ViewChild('content', { static: false }) private content:any;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
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
      this.existingUsers = []
      this.existingUsers = users;
    })
  }

  openDialogForNew(){
    this.open(this.content);
    console.log('open dialog for new ')
  }

  updateUserType(type: string){
    this.userType = type;
    console.log(this.userType); 
  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(){
    let formData = this.issuedBookForm.value;
    // console.log(formData);
    //formatting new user to save
    let issuedBook: Book | undefined;
    let userToSave = this.formatUserToSave(formData);
    

    if(this.userType == 'new'){
      forkJoin({
        savedUser: this.userService.saveUser(userToSave), 
        books: this.bookService.books.pipe(take(1)) 
      }).subscribe(({ savedUser, books }) => {
        issuedBook = books.find(book => book.uniqueBookId === formData.uniqueBookId);
        if(issuedBook){
          this.formatBookWithBorrowedUserAndUpdate(issuedBook, savedUser, formData);
        }
  
        
      });
    }
    else if(this.userType == 'existing'){
      let user = this.existingUsers.find(user=> user.id == formData.existingUser)
      console.log('borrowed user ', user);
      this.bookService.books.subscribe(books=>{
        issuedBook = books.find(book => book.uniqueBookId === formData.uniqueBookId);
        console.log('issued book befor pushing borrowed user ', issuedBook);
        // console.log('save ....')
        if(issuedBook){
          this.formatBookWithBorrowedUserAndUpdate(issuedBook, user, formData);
        }
      })
    }


    this.modalDialog.close();
    
  }

  setBorrowedBy(savedUser: any){
    const issueDate = new Date(); // Get the current date
    const returnDate = new Date(issueDate); // Create a copy of currentDate
    returnDate.setDate(returnDate.getDate() + this.daysToReturn);

    let borrowedBy!: BorrowedUser ;
    if(savedUser.id){
      borrowedBy = {
        userId: savedUser.id,
        username: savedUser.username,
        issueDate: issueDate,
        returnDate: returnDate,
        isOverdue: false
  
      }
    }
    return borrowedBy;
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
    
    borrowedUser = this.setBorrowedBy(savedUser);

    

    if (issuedBook) {
      if (!issuedBook.borrowedBy) {
        issuedBook.borrowedBy = [];
      }
 

      const userExists = issuedBook.borrowedBy.some(user => user.userId === borrowedUser.userId);

      if (!userExists) {
        issuedBook.borrowedBy.push(borrowedUser);
        console.log('Updated issued book:', issuedBook);
        this.bookService.updateBook(issuedBook);
      } else {
        console.warn('User already exists in borrowedBy, skipping duplicate update.');
      }
    } else {
      console.warn('No matching book found!');
    }
  }
}

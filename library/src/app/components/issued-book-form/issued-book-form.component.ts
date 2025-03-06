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
import Swal from 'sweetalert2';

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
      userType: ['existing'],
      existingUser: [null],
      newUser: this.fb.group({
        username: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
        address: ['', Validators.required]
      }),
      uniqueBookId: ['', [Validators.required, Validators.minLength(7)]]
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
    this.updateFormValidation();
    this.resetFormIfDismiss();
  }

  updateUserType(type: string){
    this.userType = type;
    console.log('user type', type)
    this.updateFormValidation();
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
      let user = this.existingUsers.find(user=> user.id == formData.existingUser);
      this.bookService.books.pipe(take(1)).subscribe(books=>{
        issuedBook = books.find(book => book.uniqueBookId === formData.uniqueBookId.trim());
        if(issuedBook){
          this.formatBookWithBorrowedUserAndUpdate(issuedBook, user, formData);
        }else{
          console.log('book not found to issued')
        }
      })
    }
    this.saveFlag =false;
    this.issuedBookForm.reset({userType: 'existing'});
    this.userType = 'existing';
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
    // console.log('save issued book')
    let borrowedUser: BorrowedUser;
    
    borrowedUser = this.bookService.setBorrowedBy(savedUser, issuedBook);
    

    if (issuedBook) {
      if (!issuedBook.borrowedBy) {
        issuedBook.borrowedBy = [];
      }
 

      const userExists = issuedBook.borrowedBy.some(user => user.userId === borrowedUser.userId);

      if (!userExists) {
        // let flag = true;
        issuedBook.borrowedBy.push(borrowedUser);
        this.saveIssuedBook(issuedBook);
        
      }
    } else {
      console.warn('No matching book found!');
    }
  }

  resetFormIfDismiss(){
    this.modalDialog.dismissed.subscribe(()=>{
      this.issuedBookForm.reset({userType: 'existing'});
      this.userType = 'existing'
    })
  }

  saveIssuedBook(issuedBook: Book){
    Swal.fire({
      title: "Do you want to save an issued book?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.updateBook(issuedBook).subscribe();
        
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Issued book is not saved", "", "info");
      }
    });
  }

  get isFormValid(): boolean{
    // this.updateFormValidation();
    // this.userType = 'existing';
    console.log('form valid ', this.issuedBookForm.valid)
    const isExistingAuthorSelected = !!this.issuedBookForm.get('existingUser')?.value;
    return this.issuedBookForm.valid;

  }

  updateFormValidation() {
    if (this.issuedBookForm.get('userType')?.value === 'existing') {
      // Clear new author fields' validators
      this.issuedBookForm.get('newUser')?.reset();
      this.issuedBookForm.get('newUser.username')?.clearValidators();
      this.issuedBookForm.get('newUser.phone')?.clearValidators();
      this.issuedBookForm.get('newUser.address')?.clearValidators();
  
      // Ensure existing author selection is required
      this.issuedBookForm.get('existingUser')?.setValidators([Validators.required]);
    } else {
      // Clear existing author validator
      this.issuedBookForm.get('existingUser')?.reset();
      this.issuedBookForm.get('existingUser')?.clearValidators();
  
      // Set validators for new author fields
      this.issuedBookForm.get('newUser.username')?.setValidators([Validators.required]);
      this.issuedBookForm.get('newUser.phone')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
      this.issuedBookForm.get('newUser.address')?.setValidators([Validators.required]);
    }
  
    // Reset touched & pristine states to ensure UI updates
    this.issuedBookForm.get('existingUser')?.updateValueAndValidity();
    this.issuedBookForm.get('newUser.username')?.updateValueAndValidity();
    this.issuedBookForm.get('newUser.phone')?.updateValueAndValidity();
    this.issuedBookForm.get('newUser.address')?.updateValueAndValidity();
  }

}

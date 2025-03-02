import { Author } from '@/app/models/author';
import { Book } from '@/app/models/book';
import { AuthorService } from '@/app/services/author/author.service';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { retryWhen, take } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, 
            ReactiveFormsModule,
            NgbRatingModule],
  providers: [DatePipe],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit{

  bookForm!: FormGroup;
  selectedFileName: string = '';
  maxRating = 5;
  modalDialog!: NgbModalRef;
  bookCoverFile!: File;
  authorType: string = 'existing'; // Default to existing author
  editMode: boolean = false;
  bookToEdit: Book | undefined;
  hasInjectedButton: boolean = false;

  existingAuthors: Author[] = [];

  @ViewChild('content', { static: false }) private content:any;

  constructor(private fb: FormBuilder, 
              private modalService: NgbModal, 
              private bookService: BookService,
              private authorService: AuthorService,
              private elementRef: ElementRef,
              private datePipe: DatePipe ){
                
    this.bookForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(200)]],
      image: [null, Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      availableCount: [1, [Validators.required, Validators.min(1)]],
      bookDetails: this.fb.group({
        details: ['', Validators.required],
        page: [, [Validators.required, Validators.min(3)]],
        genres: this.fb.array([]) 
      }),
      authorType: ['existing'], // Radio button selection
      existingAuthor: [null], // Holds the selected existing author
      newAuthor: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthday: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {

    this.loadAllAuthor();
  }

  ngAfterContentInit() {
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[add-book]');
  }

  openDialogForNew(){
    this.editMode = false;
    this.loadAllAuthor();
    this.open(this.content);
    this.resetFormIfDismiss();
  }

  openDialogForUpdate(book:Book){
    this.editMode = true;
    this.bookToEdit = book;
   
    this.patchGenres(book);
    this.bookForm.patchValue({
      name: book.name,
      price: book.price,
      rating: book.rating,
      availableCount: book.availableCount,
      bookDetails: {
        details: book.bookDetails.details,
        page: book.bookDetails.page,
      },
      newAuthor: {
        firstName: book.author?.firstName,
        lastName: book.author?.lastName,
        birthday: this.bookService.formatDate(book.author?.birthday)
      }
    })
    console.log('img url ', book.imgUrl)
    this.open(this.content);
    this.resetFormIfDismiss();
    
  }

  
  private patchGenres(book: Book) {
    
    if (book.bookDetails.genres) {

      book.bookDetails.genres.forEach(() => {
        this.genres.push(this.fb.control('',Validators.required));
      });
      this.bookForm.patchValue({
        bookDetails: {
          genres: book.bookDetails.genres
        }
      })
    }
  }

  

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

  onFileChange(event: any) {
    this.bookCoverFile = event.target.files[0];
    if (this.bookCoverFile) {
      this.selectedFileName = this.bookCoverFile.name;
      this.bookForm.patchValue({ image: this.bookCoverFile.name });
      this.bookForm.get('image')?.updateValueAndValidity();
    }
    else{
      this.bookForm.patchValue({ image: null });
      this.bookForm.get('image')?.markAsTouched();
    }
  }

  get genres(): FormArray {
    return this.bookForm.get('bookDetails')?.get('genres') as FormArray;
  }

  // Update Author Type
  updateAuthorType(type: string): void {
    this.authorType = type;
    this.updateFormValidation();
  }

  addGenre(): void {
    this.genres.push(this.fb.control('', Validators.required));
  }

  removeGenre(index: number): void {
    this.genres.removeAt(index);
  }

  onSubmit() {

    if(!this.editMode){
        this.bookService.uploadBookCover(this.bookCoverFile).subscribe(response => {
          // console.log(response.imgUrl); 
          this.bookForm.value.image = response.imgUrl;
          let book: Book = this.formatFormData();
          this.saveBook(book);
          if(book.author){
            this.authorService._saveAuthor(book.author);
          }

          this.bookForm.reset({authorType : 'existing'});
          this.authorType = 'existing';
          this.genres.controls = [];
      });
    }
    else {
      let modifiedBook = this.formatFormDataForUpdateBook(this.bookToEdit);
      this.bookService.updateBook(modifiedBook).subscribe();
    }
    this.modalDialog.close();
    
}

saveBook(data: any) {
  Swal.fire({
    title: "Do you want to save a new book?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookService.saveBook(data);
      
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

updateFormValidation() {
  if (this.bookForm.get('authorType')?.value === 'existing') {
    console.log('existing author');
    // Clear new author fields' validators
    this.bookForm.get('newAuthor')?.reset();
    this.bookForm.get('newAuthor.firstName')?.clearValidators();
    this.bookForm.get('newAuthor.lastName')?.clearValidators();
    this.bookForm.get('newAuthor.birthday')?.clearValidators();

    // Ensure existing author selection is required
    this.bookForm.get('existingAuthor')?.setValidators([Validators.required]);
  } else {
    console.log('new author');
    // Clear existing author validator
    this.bookForm.get('existingAuthor')?.reset();
    this.bookForm.get('existingAuthor')?.clearValidators();

    // Set validators for new author fields
    this.bookForm.get('newAuthor.firstName')?.setValidators([Validators.required]);
    this.bookForm.get('newAuthor.lastName')?.setValidators([Validators.required]);
    this.bookForm.get('newAuthor.birthday')?.setValidators([Validators.required]);
  }

  // Reset touched & pristine states to ensure UI updates
  this.bookForm.get('existingAuthor')?.updateValueAndValidity();
  this.bookForm.get('newAuthor.firstName')?.updateValueAndValidity();
  this.bookForm.get('newAuthor.lastName')?.updateValueAndValidity();
  this.bookForm.get('newAuthor.birthday')?.updateValueAndValidity();
}

get isFormValid(): boolean | undefined{
  const isFormValid = this.bookForm.valid;
  if(!this.editMode){
    const isExistingAuthorSelected = !!this.bookForm.get('existingAuthor')?.value;
    
    const isPriceValid = this.bookForm.get('price')?.valid;
    const isFileValid = this.bookForm.get('image')?.valid; // Ensure file input is valid

    return (isFormValid || isExistingAuthorSelected) && isFileValid && isPriceValid;
  }
  else{
    this.bookForm.get('image')?.clearValidators();
    this.bookForm.get('image')?.updateValueAndValidity();
    return isFormValid;
  }
}

formatFormDataForUpdateBook(book:Book | undefined): Book{
  let formData = this.bookForm.value;
  let bookData!: Book;
    if(book){
      bookData = {
        id: book.id,
        name: formData.name,
        price: formData.price,
        imgUrl: book.imgUrl,
        bookDetails: {
          id: book.bookDetails.id,
          details: formData.bookDetails.details,
          genres: formData.bookDetails.genres,
          page: formData.bookDetails.page
        },
        author: {
          id: book.author?.id,
          firstName: formData.newAuthor.firstName,
          lastName: formData.newAuthor.lastName,
          birthday: formData.newAuthor.birthday
        },
        rating: formData.rating,
        isAvailable: true,
        totalCount: formData.availableCount,
        availableCount: formData.availableCount,
        borrowedBy: book.borrowedBy

    }
    
  }
  return bookData;
  
}


formatFormData(): Book{

  let formData = this.bookForm.value;

  let bookData: Book = {
    
      name: formData.name,
      price: formData.price,
      imgUrl: formData.image,
      bookDetails: {
        details: formData.bookDetails.details,
        genres: formData.bookDetails.genres,
        page: formData.bookDetails.page
      },
      rating: formData.rating,
      isAvailable: true,
      totalCount: formData.availableCount,
      availableCount: formData.availableCount
    

  }

  if (formData.authorType === 'new') {
    bookData.author = {
      firstName: formData.newAuthor.firstName,
      lastName: formData.newAuthor.lastName,
      birthday: formData.newAuthor.birthday
    };
  } else {
    let id = formData.existingAuthor;
    let existingAuthor = this.existingAuthors.filter(author=> author.id == id);
    bookData.author = { 
      id,
      firstName: existingAuthor[0].firstName,
      lastName: existingAuthor[0].lastName,
      birthday: existingAuthor[0].birthday
    }; 
  }
  return bookData;
}

loadAllAuthor(): void{
  this.authorService.fetchAuthorsFromServer();
  this.authorService.authors.subscribe(authors=> {
    this.existingAuthors = [];
    this.existingAuthors = authors;
    // this.existingAuthors.map(autor => console.log(autor))
    })
}

resetFormIfDismiss():void{
  this.modalDialog.dismissed.subscribe(() => {
    this.genres.controls = [];
    this.bookForm.reset({authorType: 'existing'});
    this.authorType = 'existing';
    // this.genres.push();
  });
}
}

import { BookService } from '@/app/services/admin/book.service';
import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, 
            ReactiveFormsModule,
            NgbRatingModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent {

  bookForm!: FormGroup;
  selectedFileName: string = '';
  maxRating = 5;
  modalDialog!: NgbModalRef;
  bookCoverFile!: File;
  authorType: string = 'existing'; // Default to existing author

  existingAuthors = [
    { id: 1, fullName: 'J.K. Rowling' },
    { id: 2, fullName: 'George R.R. Martin' },
    { id: 3, fullName: 'J.R.R. Tolkien' }
  ];

  // private modalService = inject(NgbModal);
  @ViewChild('content', { static: false }) private content:any;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private bookService: BookService){
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      image: [null, Validators.required],
      rating: [0, [Validators.required, Validators.maxLength(5)]],
      availableCount: [1, [Validators.required, Validators.min(1)]],
      bookDetails: this.fb.group({
        details: ['', Validators.required],
        page: [1, [Validators.required, Validators.min(1)]],
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

  openDialogForNew(){
    this.open(this.content);
  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

  onFileChange(event: any) {
    this.bookCoverFile = event.target.files[0];
    if (this.bookCoverFile) {
      this.selectedFileName = this.bookCoverFile.name;
      this.bookForm.patchValue({ image: this.bookCoverFile.name });
    }
  }

  get genres(): FormArray {
    return this.bookForm.get('bookDetails')?.get('genres') as FormArray;
  }

  // Update Author Type
  updateAuthorType(type: string): void {
    this.authorType = type;
  }

  addGenre(): void {
    this.genres.push(this.fb.control('', Validators.required));
  }

  removeGenre(index: number): void {
    this.genres.removeAt(index);
  }

  onSubmit() {
    console.log(this.bookForm.value);
    this.modalDialog.close();
    
    this.bookService.uploadBookCover(this.bookCoverFile).subscribe(response => {
        console.log(response.imgUrl); 
        this.bookForm.patchValue({image: response.imgUrl})
        // this.submitBookData();
        this.removeUselessFields();
        this.bookForm.reset();
    });
}

removeUselessFields(){
  if (this.bookForm.valid) {
    let formData = { ...this.bookForm.value };

    // Remove unnecessary author data based on selection
    if (formData.authorType === 'existing') {
      delete formData.newAuthor;
    } else {
      delete formData.existingAuthor;
    }
    delete formData.authorType; // Remove authorType if not needed

    console.log("Final Data to Send:", formData);
  }
}

submitBookData() {
    console.log('Submitting book:', this.bookForm.value);
}


}

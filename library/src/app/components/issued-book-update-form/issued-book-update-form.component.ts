import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  @Input()
  user!: any;

  @Input()
  book!: Book | undefined;

  @ViewChild('content', { static: false }) private content:any;
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  )
  {
      this.issuedBookForm = this.fb.group({
        username: ['', Validators.required],
        title: ['', [Validators.required]],
        issuedDate: ['', Validators.required],
        returnDate: ['', Validators.required],
    });
  }

  showEditDialog(){
    this.patchValueToUpdate();
    this.open(this.content);
  }

  updateIssuedBook(){
    let formData = this.issuedBookForm.value;
    console.log(formData)
    this.modalDialog.close();
  }

  patchValueToUpdate(){
    this.issuedBookForm.patchValue({
      username : this.user.username,
      title: this.book?.name,
      issuedDate: this.user.issueDate,
      returnDate: this.user.returnDate
    })
  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-issued-book-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './issued-book-form.component.html',
  styleUrl: './issued-book-form.component.css'
})
export class IssuedBookFormComponent {

  issuedBookForm!: FormGroup;
  modalDialog!: NgbModalRef;
  @ViewChild('content', { static: false }) private content:any;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder) 
  {

    this.issuedBookForm = this.fb.group({
      name: ['', [Validators.required]]
    });

  }

  openDialogForNew(){
    this.open(this.content);
    console.log('open dialog for new ')
  }

  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(){
    console.log('on submit ....')
  }
}

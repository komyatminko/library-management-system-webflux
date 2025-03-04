import { User } from '@/app/models/user';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issued-user-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './issued-user-form.component.html',
  styleUrl: './issued-user-form.component.css'
})
export class IssuedUserFormComponent {
  
  issuedUserForm!: FormGroup;
  modalDialog!: NgbModalRef;

  @Input()
  user!: User;

  @ViewChild('content', { static: false }) private content:any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private userService: UserService,
    )
  {

      this.issuedUserForm = this.fb.group({
          username: ['', [Validators.required, Validators.minLength(5)]],
          phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
          address: ['', Validators.required]
      });

  }

  ngOnInit(){
   
  }

  showEditDialog(){

    this.patchValueToUpdate();
    this.open(this.content);
    this.resetFormIfDismiss();
  }

  patchValueToUpdate(){
    this.issuedUserForm.patchValue({
      username : this.user.username,
      phone : this.user.phone,
      address : this.user.address
    })
  }

  updateIssuedUser(){
    Swal.fire({
      title: "Do you want to update an issued user?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
       
        let formData = this.issuedUserForm.value;
        let issuedUserToUpdate = {
          ...this.user,
          username: formData.username,
          phone: formData.phone,
          address: formData.address
        }
        this.userService.updateUser(issuedUserToUpdate);

        Swal.fire("Updated!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Issued user is not updated", "", "info");
      }
    });
    
    this.modalDialog.close();
  }


  open(content: TemplateRef<any>) {
    this.modalDialog = this.modalService.open(content, {  size: 'lg' ,ariaLabelledBy: 'modal-basic-title' });
  }

  resetFormIfDismiss(){
    this.modalDialog.dismissed.subscribe(()=>{
      this.issuedUserForm.reset();
    })
  }

  get isFormValid(): boolean{
    return this.issuedUserForm.valid;
  }
  

}

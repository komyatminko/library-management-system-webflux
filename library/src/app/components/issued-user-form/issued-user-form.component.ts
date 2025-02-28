import { User } from '@/app/models/user';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
    private userService: UserService,
    )
  {

      this.issuedUserForm = this.fb.group({
          username: ['', Validators.required],
          phone: ['', [Validators.required, Validators.maxLength(9)]],
          address: ['', Validators.required]
      });

  }

  ngOnInit(){
    // console.log('user to update ', this.user);
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
    let formData = this.issuedUserForm.value;
    let issuedUserToUpdate = {
      ...this.user,
      username: formData.username,
      phone: formData.phone,
      address: formData.address
    }
    this.userService.updateUser(issuedUserToUpdate);
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

}

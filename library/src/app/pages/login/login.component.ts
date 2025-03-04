
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private router: Router
            ) 
  {
      this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Helper to access form controls in the template
 
  get username(){
    return this.loginForm.controls['username'];
  }

  get password(){
    return this.loginForm.controls['password'];
  }

  onSubmit() {


    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
      const userData = this.loginForm.value;
      // alert('Login Successful!');
      this.authService.login(userData)
        .subscribe(data => {
          console.log('data after login ', data)
          this.loginSuccess(data);
        },
        err => console.log('ERROR ', err))
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  loginSuccess(data:any){
    this.authService.setAuthentication(data.token)
    let role = this.authService.getUserRole();
    if(role === 'ADMIN'){
      this.router.navigate(['/admin']);
    }
    else{
      this.router.navigate(['/user']);
    }
  }
}


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
  isLoginError: boolean = false

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
      const userData = this.loginForm.value;
      this.authService.login(userData)
        .subscribe(
          data => {
            this.loginSuccess(data.data);
            this.isLoginError = false;
          },
          err => {
            this.isLoginError = true;
          }
        )
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  loginSuccess(data:any){
    // console.log('token', data.token)
    this.authService.setAuthentication(true);
    this.authService.setToken(data.token);
    let role = this.authService.getUserRole();
    let username = this.authService.getUsername();
    localStorage.setItem('username', username)
    if(role === 'ADMIN'){
      // console.log('data.username', this.authService.getUsername())
      this.router.navigate(['/admin'],
        //  { queryParams: { username: this.authService.getUsername()} }
      );
      
    }
    else{
      this.router.navigate(['/user']);
    }
  }
}

import { Component } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Library Web';
  constructor(private authService: AuthService, private router: Router){}
  
  ngOnInit(){
    let isAuthenticated = this.authService.getAuthentication();
    if(isAuthenticated){
      if(this.authService.isAdmin()){
        this.router.navigate(['/admin']);
        console.log('user is authenticated')
      }
      else {
        this.router.navigate(['/usesr']);
      }
    }
  }
  

}

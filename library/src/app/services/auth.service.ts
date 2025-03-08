import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { JwtPayload } from '../models/jwt-payload';
import { User } from '../models/user';
import { UserForm } from '../models/user-form';
import { BASE_URL } from './Api';

const AUTH_BASE_URL = BASE_URL+'/api/auth';

headers: new HttpHeaders({ 'Content-Type': 'application/json' })
const httpOptions = {

};


@Injectable({
  providedIn: 'root'      
})
export class AuthService {

  private token: string = '';
  private isAuthenticated: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }

  login(user: UserForm): Observable<any> {
    return this.http.post(AUTH_BASE_URL + '/login', user, { withCredentials: true });
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<{ data: User; status: string }>(AUTH_BASE_URL + '/me', { withCredentials: true }).pipe(
      map(response => {
        // Check if response status is "success" and user data is available
        return response.status === 'success' && !!response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        // Log the error and handle unauthorized or other errors gracefully
        console.error('Error during authentication check:', error.message);
  
        if (error.status === 401 || error.status === 404) {
          // Handle specific unauthorized scenarios
          return of(false); // User is not authenticated
        }
        return of(false); // General case for other errors
      })
    );
  }

  logout() {
    this.http.post<{ message: string }>(AUTH_BASE_URL + '/logout', {}, { withCredentials: true }).subscribe({
      next: (response) => {
        this.token = ''; // Clear the token
        this.isAuthenticated = false; // Update auth status
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (err) => {
        console.error('Logout failed', err); // Handle errors
      }
    });
  }
  
  getToken(){
    return this.token;
  }

  setToken(token: string){
    this.token = token;
  }

  setAuthentication(isAuthenticated: boolean){
    // this.token = token;
    this.isAuthenticated = isAuthenticated;
  }

  getAuthentication() : boolean{
    return this.isAuthenticated;
  }

  getDecodeToken(){
    const token = this.getToken();
    if(!token) return null;

    try{
      return jwtDecode<JwtPayload>(token);
    }
    catch(err){
      console.error('invalid token ', token);
      return null;
    }
  }

  getUserRole(): string | undefined {
    const decodeToken = this.getDecodeToken();
    return decodeToken?.auth[0];
  }

  getUsername(): string {
    const decodeToken = this.getDecodeToken();
    return decodeToken?.sub || 'Unknown';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN'
  }
}

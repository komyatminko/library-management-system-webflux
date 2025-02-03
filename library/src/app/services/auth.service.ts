import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { JwtPayload } from '../models/jwt-payload';
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
    return this.http.post(AUTH_BASE_URL + '/login', user, httpOptions);
  }

  logout(){
    this.token = '';
    this.isAuthenticated = false;
    this.router.navigate(['/login'])
  }

  getToken(){
    return this.token;
  }

  setToken(token: string){
    this.token = token;
  }

  setAuthentication(token: string){
    this.token = token;
    this.isAuthenticated = true;
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

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN'
  }
}

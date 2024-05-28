import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseApiUrl = environment.apiUrl;
private currentUserSource = new BehaviorSubject<User | null>(null);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
   return this.http.post<User>(this.baseApiUrl+'account/login',model).pipe(
      map((result:User) => {
        const user = result;
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }


  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
  decodeToken(token:string){
    console.log("Token : " + token);
    const payLoad = token.split(".")[1];
    const decoded = atob(payLoad);
    const returningValue = JSON.parse(decoded);
    return returningValue ;
  }

  setCurrentUser(user: User){
    const roles = this.decodeToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
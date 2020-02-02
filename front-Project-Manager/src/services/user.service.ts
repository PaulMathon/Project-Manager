import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {Subject} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
    this.getUsers();
  }


  private users: User[] = [];
  usersSubject = new Subject<User[]>();
  private user: User;
  userSubject = new Subject<User>();

  emitUsers() {
    this.usersSubject.next(this.users);
  }

  getUsers() {
    this.http.get<User[]>(`${environment.serverURL}/api/users`)
      .subscribe(data => {
        this.users = data;
        this.emitUsers();
      }, err => {
        console.error('error');
      });
  }

  emitUser() {
    this.userSubject.next(this.user);
  }

  getUser(userId) {
    this.http.get<any>(`${environment.serverURL}/api/user/${userId}`)
      .subscribe(user => {
        console.log(user);
        this.user = user;
        this.emitUser();
      }, err => {
        console.log('error', err);
      });
  }

  updateProfileInfo(user, modif) {
    const requestBody = user;
    requestBody.modification = modif;
    console.log(requestBody);
    this.http.put<any>(`${environment.serverURL}/api/user/update/${user._id}`, requestBody)
      .subscribe(updatedStatus => {
        delete requestBody.modification;
        this.emitUser();
      }, error => {
        console.error(error);
      });
  }

  updatePassword(user, newPassword) {
    const requestBody = user;
    requestBody.password = newPassword;
    requestBody.modification = 'password';
    return this.http.put<any>(`${environment.serverURL}/api/user/update/${user._id}`, requestBody);
  }

}

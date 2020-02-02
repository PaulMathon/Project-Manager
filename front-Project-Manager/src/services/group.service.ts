import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groups: any[];
  groupsSubject = new Subject<any>();

  private group: any;
  groupSubject = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  emitGroups() {
    this.groupsSubject.next(this.groups);
  }

  getGroups() {
    this.http.get<any>(`${environment.serverURL}/api/group/all`)
      .subscribe(data => {
        this.groups = data;
        this.emitGroups();
      }, error => {
        console.error(error);
      });
  }

  getGroupsFromUser(userId: string) {

    const params = new HttpParams()
      .set('user_id', userId);

    this.http.get<any>(`${environment.serverURL}/api/group/allfromuser`, { params })
      .subscribe(data => {
        this.groups = data;
        this.emitGroups();
      }, err => {
        console.error('error');
      });
  }

  emitGroup() {
    this.groupSubject.next(this.group);
  }

  newGroup(title, description, members, endDate) {
    const currentDate = Date.now();
    console.log(members);
    return this.http.post<any>(`${environment.serverURL}/api/group/add`,
      { title,
        description,
        members,
        startDate: currentDate,
        endDate,
        meetingsDone: [],
        meetingsPlanned: []})
      .subscribe(data => {
        console.log('DATA', data);
        this.group = data;
        this.emitGroup();
      }, err => {
        console.error('error', err);
      });
  }

  getGroupById(_id: string) {

    const params = new HttpParams()
      .set('_id', _id);

    return this.http.get<any[]>(`${environment.serverURL}/api/group/one`, {params})
      .subscribe(data => {
        this.group = data;
        this.emitGroup();
      });
  }

  addMembers(group) {
    this.http.put(`${environment.serverURL}/api/group/update/members/${group._id}`, group)
      .subscribe(updateStatus => {
        console.log(updateStatus);
      });
  }

  removeMember(group, userId) {
    this.http.put(`${environment.serverURL}/api/group/${group._id}/delete/member/${userId}`, group)
      .subscribe(updateStatus => {
        console.log(updateStatus);
      });
  }

  updateEndDate(group) {
    this.http.put<{n: number, nModified: number, ok: number}>(`${environment.serverURL}/api/group/${group._id}/update/enddate`, group)
      .subscribe(updateStatus => {
        console.log(updateStatus);
        if (updateStatus.n === 1 && updateStatus.nModified === 1 && updateStatus.ok === 1) {
          this.group = group;
          this.emitGroup();
        }
      });
  }

  removeGroup(groupId) {
    return this.http.delete(`${environment.serverURL}/api/group/delete/${groupId}`);
  }
}

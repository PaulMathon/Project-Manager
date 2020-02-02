import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../../../services/user.service';
import {User} from '../../../../../models/user.model';
import {GroupService} from '../../../../../services/group.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<ProfileOverviewComponent>,
              private userService: UserService,
              private groupService: GroupService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.user = { ...this.data.member, schoolYear: '' };
    this.userService.userSubject.subscribe(user => this.user = user);
    this.userService.getUser(this.data.member._id);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onRemoveMember() {
    this.groupService.removeMember(this.data.group, this.user._id);
    this.data.group.members = this.data.group.members.filter(member => member._id !== this.user._id);
    this.dialogRef.close( {
      group: this.data.group,
      actionData: {
        action: 'remove',
        user: `${this.user.name} ${this.user.lastName}`,
      }
    });
  }

}

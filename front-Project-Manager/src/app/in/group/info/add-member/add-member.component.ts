import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../../services/user.service';
import {User} from '../../../../../models/user.model';
import {GroupService} from '../../../../../services/group.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  addMemberForm: FormGroup;
  unpickedMembers: any[];
  pickedMembers: User[];
  showDropDownUsers = false;
  selectedMember = -1;

  constructor(public dialogRef: MatDialogRef<AddMemberComponent>,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private groupService: GroupService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.pickedMembers = [];
    this.initForm();
    this.userService.usersSubject.subscribe(users => {
      console.log(this.data.group.members);
      console.log(this.data.group.members.map(member => member._id));
      this.unpickedMembers = users.filter(user => !this.data.group.members.map(member => member._id).includes(user._id));
      console.log(this.unpickedMembers);
    }, error => {
      console.error('error when fetching the users\'s data', error);
    });
    this.userService.getUsers();
  }

  initForm() {
    this.addMemberForm = this.formBuilder.group({
      member: ['']
    });
  }

  toggleDropDownUsers() {
    this.showDropDownUsers = true;
    this.selectedMember = -1;
    console.log(this.showDropDownUsers);
  }

  unToggleDropDownUsers() {
    this.showDropDownUsers = false;
  }

  getSearchValue() {
    return this.addMemberForm.value.members;
  }

  onAddMember(member) {
    console.log(member);
    this.pickedMembers.push(member);
    for (let i = 0; i < this.unpickedMembers.length; i++) {
      if (this.unpickedMembers[i] === member) {
        this.unpickedMembers.splice(i, 1);
      }
    }
    this.showDropDownUsers = true;
  }

  /**
   * @function ON REMOVE MEMBER
   * @description event function removing a specified user to remove
   * @param member | object | member to remove
   */
  onRemoveMember(member) {
    for (let i = 0; i < this.pickedMembers.length; i++) {
      if (this.pickedMembers[i] === member) {
        this.pickedMembers.splice(i, 1);
      }
    }
  }

  onSelectMembers(e) {
    const event = e || window.event;
    if (this.showDropDownUsers && event.keyCode === 40) {
      if (this.selectedMember < this.unpickedMembers.length - 1) {
        if (this.selectedMember > -1) {
          this.unpickedMembers[this.selectedMember].selected = false;
        }
        this.selectedMember ++;
        this.unpickedMembers[this.selectedMember].selected = true;
      }
    } else if (this.showDropDownUsers && event.keyCode === 38) {
      if (this.selectedMember > -1) {
        this.unpickedMembers[this.selectedMember].selected = false;
        this.selectedMember --;
        if (this.selectedMember > -1) {
          this.unpickedMembers[this.selectedMember].selected = true;
        }
      }
    } else if (this.showDropDownUsers && event.keyCode === 13) {
      this.onAddMember(this.unpickedMembers[this.selectedMember]);
      this.selectedMember = -1;
    }
  }

  onSubmit() {


    this.data.group.members = this.data.group.members.concat(this.pickedMembers);
    this.groupService.addMembers(this.data.group);

    let users = '';
    this.pickedMembers.forEach(pickedMember => users += `${pickedMember.name} ${pickedMember.lastName}, `);
    this.dialogRef.close({
      group: this.data.group,
      actionData: {
        action: 'add',
        users
      }
    });

  }

  cancelDialog() {
    this.dialogRef.close();
  }



}

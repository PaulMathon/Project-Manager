import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {

  newGroupForm: FormGroup;
  users: Array<any>;
  members: User[] = [
    JSON.parse(localStorage.getItem('currentUser'))
  ];

  showDropDownUsers = false;
  selectedMember = -1;

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();

    this.userService.usersSubject.subscribe(users => {
      this.users = users.filter(user => user._id !== this.members[0]._id);
      console.log(this.users);
    }, error => {
      console.error('error when fetching the users\'s data', error);
    });
    this.userService.getUsers();
  }

  initForm() {
    this.newGroupForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      members: '',
      endDate: ['', Validators.required]
    });
  }

  toggleDropDownUsers() {
    this.showDropDownUsers = !this.showDropDownUsers;
    if (this.showDropDownUsers) {
      this.selectedMember = -1;
    }
    console.log(this.showDropDownUsers);
  }

  getSearchValue() {
    return this.newGroupForm.value.members;
  }

  onAddMember(member) {
    console.log(member);
    this.members.push(member);
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === member) {
        this.users.splice(i, 1);
      }
    }
    this.showDropDownUsers = true;
  }

  onRemoveMember(member) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i] === member) {
        this.members.splice(i, 1);
      }
    }
  }

  onSelectMembers(e) {
    const event = e || window.event;
    if (this.showDropDownUsers && event.keyCode === 40) {
      if (this.selectedMember < this.users.length - 1) {
        if (this.selectedMember > -1) {
          this.users[this.selectedMember].selected = false;
        }
        this.selectedMember ++;
        this.users[this.selectedMember].selected = true;
      }
    } else if (this.showDropDownUsers && event.keyCode === 38) {
      if (this.selectedMember > -1) {
        this.users[this.selectedMember].selected = false;
        this.selectedMember --;
        if (this.selectedMember > -1) {
          this.users[this.selectedMember].selected = true;
        }
      }
    } else if (this.showDropDownUsers && event.keyCode === 13) {
      this.onAddMember(this.users[this.selectedMember]);
      this.selectedMember = -1;
    }
  }

  onSubmit() {
    const formValue = this.newGroupForm.value;
    const title = formValue.title;
    const description = formValue.description;
    const endDate = formValue.endDate;

    this.groupService.groupSubject.subscribe(group => {
      this.router.navigate(['/in/groups']);
    }, err => {
      console.error('error', err);
    });

    this.groupService.newGroup(title, description, this.members, endDate);
  }

}

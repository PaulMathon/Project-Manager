import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GroupService} from '../../../../services/group.service';
import {MatDialog} from '@angular/material/dialog';
import {AddMemberComponent} from './add-member/add-member.component';
import {ProfileOverviewComponent} from './profile-overview/profile-overview.component';
import {RemoveProjectDialogComponent} from './remove-project-dialog/remove-project-dialog.component';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

const randomProfilePicturesData = {
  0: {
    image: 'cat'
  },
  1: {
    image: 'cow'
  },
  2: {
    image: 'owl'
  },
  3: {
    image: 'penguin'
  },
  4: {
    image: 'pig'
  },
  5: {
    image: 'rabbit'
  }
};

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  group = {
    _id: '',
    title: '',
    description: '',
    members: [],
    startDate: '',
    endDate: '',
    meetingsDone: '',
    meetingsPlanned: ''
  };

  notificationPopInAttributes = {
    action: '',
    user: '',
    users: ''
  };
  isPopinActive = false;

  timeUntilEnd: {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  };

  showEndDateInput = false;
  modifyEndDateForm: FormGroup;


  constructor(private http: HttpClient,
              public dialog: MatDialog,
              private groupService: GroupService,
              private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.group = JSON.parse(localStorage.getItem('currentGroup'));

    this.attributeProfilePicture();

    this.timeUntilEnd = this.convertSecondsToDate(new Date(this.group.endDate).getTime() - Date.now());

    setInterval(() => this.timeUntilEnd = this.convertSecondsToDate(new Date(this.group.endDate).getTime() - Date.now()), 1000);
    this.initForm();
  }

  attributeProfilePicture() {
    const membersLength = this.group.members.length;
    for (let i = 0; i < membersLength; i += 1) {
      const profilePictureUrl = '../../assets/pictures/profile-pictures/' + this.group.members[i]._id + '.png';
      this.http.get(profilePictureUrl).subscribe(
        image => {
          this.group.members[i].profilePicture = profilePictureUrl;
        },
        error => {
          if (error.status === 200) {
            this.group.members[i].profilePicture = profilePictureUrl;
          } else {
            const randomNumber = Math.round(Math.random() * 5);
            const randomImage = randomProfilePicturesData[randomNumber].image;
            this.group.members[i].profilePicture = `../../../../assets/pictures/profile-pictures/random/${randomImage}.png`;
          }
        });
    }
  }

  convertSecondsToDate(inputSeconds) {
    let nonCountedSeconds = Math.floor((inputSeconds / 1000));
    const days = Math.floor(nonCountedSeconds / (3600 * 24));
    nonCountedSeconds = nonCountedSeconds - (days * 3600 * 24);
    const hours = Math.floor(nonCountedSeconds / 3600);
    nonCountedSeconds = nonCountedSeconds - (hours * 3600);
    const minutes = Math.floor(nonCountedSeconds / 60);
    nonCountedSeconds = nonCountedSeconds - (minutes * 60);

    return {
      days,
      hours,
      minutes,
      seconds: nonCountedSeconds
    };
  }

  initForm() {
    this.modifyEndDateForm = this.formBuilder.group({
      endDate: ''
    });
  }


  onOpenProfileOverviewDialog(member) {
    const dialogRef = this.dialog.open(ProfileOverviewComponent, {
      data: {
        group: this.group,
        member
      }
    });

    this.handleDialogRefClosing(dialogRef);
  }

  onOpenAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: { group: this.group }
    });

    this.handleDialogRefClosing(dialogRef);
  }

  handleDialogRefClosing(dialogRef) {
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.group = result.group;
      this.attributeProfilePicture();
      localStorage.currentGroup = JSON.stringify(result);

      this.notificationPopInAttributes = result.actionData;
      this.showPopin();
    });
  }

  handleEndDateModif() {
    this.showEndDateInput = !this.showEndDateInput;
    console.log(this.showEndDateInput);
    if (!this.showEndDateInput) {
      const endDate = this.modifyEndDateForm.value.endDate;
      if (endDate) {
        this.group.endDate = endDate;
        this.groupService.groupSubject.subscribe(group => {
          localStorage.currentGroup = JSON.stringify(group);
        });
        this.groupService.updateEndDate(this.group);
      }
      console.log(endDate);
    }
  }

  showPopin() {
    this.isPopinActive = true;
    setTimeout(() => this.isPopinActive = false, 3000);
  }

  onOpenRemoveProjectSecurityDialog() {
    const dialogRef = this.dialog.open(RemoveProjectDialogComponent, {
      data: { group: this.group }
    });
  }

}

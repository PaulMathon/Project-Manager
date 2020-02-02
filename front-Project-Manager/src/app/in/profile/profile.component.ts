import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/user.model';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  profilePictureUrl: string;

  validProfileImage = false;

  showDateInput = false;
  showSchoolSelect = false;
  showSchoolYearSelect = false;

  actualPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  actualPasswordValid = false;

  notificationPopInAttributes = {
    attribute: '',
    modification: ''
  };
  isPopinActive = false;

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.profilePictureUrl = '../../assets/pictures/profile-pictures/' + this.user._id + '.png';
    this.http.get(this.profilePictureUrl).subscribe(
      image => this.validProfileImage = true,
      error => {
        if (error.status === 200) {
          this.validProfileImage = true;
        }
      });
    this.userService.userSubject.subscribe(user => {
      this.showPopin();
    }, error => {
      console.error(error);
    });
    this.initPasswordForms();
  }

  onFileSelected(event) {

    const fd = new FormData();
    fd.append('profilePicture', event.target.files[0] as File, this.user._id + '.png');
    this.http.post('http://localhost:3000/api/user/uploadprofile', fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(loadEvent => {
        if (loadEvent.type === HttpEventType.UploadProgress) {
          console.log('Upload progress : ', (event.loaded / event.total) * 100, '%');
        } else if (loadEvent.type === HttpEventType.Response) {
          this.router.navigate(['/in/profile']);
          console.log(loadEvent);
        }
      });
  }

  updateProfileValue(event) {
    let text = event.target.innerHTML;
    if (event.target.id) {
      switch (event.target.id) {
        case 'userName': {
          this.changeUserName(text);
          break;
        }
        case 'userDescription': {
          this.changeUserDescription(text);
          break;
        }
        case 'userDescriptionInput': {
          text = event.target.value;
          this.changeUserDescription(text);
          break;
        }
        case 'userBirthDate': {
          text = event.target.value;
          this.showDateInput = false;
          this.changeBirthdate(text);
          break;
        }
        case 'userSchool': {
          text = event.target.value;
          this.showSchoolSelect = false;
          this.changeSchool(text);
          break;
        }
        case 'userSchoolYear': {
          text = event.target.value;
          this.showSchoolYearSelect = false;
          this.changeSchoolYear(text);
          break;
        }
      }
      localStorage.currentUser = JSON.stringify(this.user);
    }
  }

  preventDefaultEnterEvent(event) {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.target.blur();
    }
  }

  changeUserName(name) {
    const cleanedName = name.match(/[a-zA-Z]+ [a-zA-Z]+/);
    if (!cleanedName) {
      window.alert('You need a name and a last name');
      return;
    }
    const nameLastNameSplitted = cleanedName[0].split(' ');
    this.user.name = nameLastNameSplitted[0];
    this.user.lastName = nameLastNameSplitted[1];
    this.userService.updateProfileInfo(this.user, 'name');
    this.notificationPopInAttributes = {
      attribute: 'name',
      modification: cleanedName
    };
  }

  changeUserDescription(description) {
    const cleanedDescription = description.match(/[^ ].+/);
    console.log(cleanedDescription);
    if (!cleanedDescription) {
      window.alert('You need to write something here...');
      return;
    }
    this.user.description = cleanedDescription[0].replace('&nbsp;', '');
    this.userService.updateProfileInfo(this.user, 'description');
    this.notificationPopInAttributes = {
      attribute: 'description',
      modification: cleanedDescription
    };
  }

  changeBirthdate(date) {
    if (!date) {
      window.alert('Please fill the date correctly');
      return;
    }
    this.user.birth = date;
    this.userService.updateProfileInfo(this.user, 'birth');
    this.notificationPopInAttributes = {
      attribute: 'birthdate',
      modification: date
    };
  }

  changeSchool(school) {
    if (!school) {
      window.alert('Please fill the school correctly');
      return;
    }
    this.user.school = school;
    this.userService.updateProfileInfo(this.user, 'school');
    this.notificationPopInAttributes = {
      attribute: 'school',
      modification: school
    };
  }

  changeSchoolYear(schoolYear) {
    if (!schoolYear) {
      window.alert('Please fill the school correctly');
      return;
    }
    this.user.schoolYear = schoolYear;
    this.userService.updateProfileInfo(this.user, 'schoolYear');
    this.notificationPopInAttributes = {
      attribute: 'school year',
      modification: schoolYear
    };
  }

  initPasswordForms() {
    this.actualPasswordForm = this.formBuilder.group({
      actualPassword: ['', Validators.required]
    });

    this.newPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  onSubmitActualPasswordForm() {
    const password = this.actualPasswordForm.get('actualPassword').value;
    if (password) {
      this.authService.login(JSON.parse(localStorage.currentUser).email, password)
        .subscribe(user => {
          console.log(user);
          this.actualPasswordValid = true;
        }, error => {
          window.alert('Wrong password');
        });
    } else {
      window.alert('You did not enter any password');
    }
  }

  onSubmitnewPasswordForm() {
    const password = this.newPasswordForm.get('newPassword').value;
    const confirmPassword = this.newPasswordForm.get('newPassword').value;
    if (password && confirmPassword && password === confirmPassword) {
      this.userService.updatePassword(JSON.parse(localStorage.currentUser), password)
        .subscribe(user => {
          console.log(user);
          this.actualPasswordValid = false;
          this.notificationPopInAttributes = {
            attribute: 'password',
            modification: '★★★★★★★★★'
          };
          this.showPopin();
        }, error => {
          window.alert('Wrong password');
        });
    } else {
      window.alert('The two password are different');
    }
  }

  showPopin() {
    this.isPopinActive = true;
    console.log(this.notificationPopInAttributes);
    setTimeout(() => this.isPopinActive = false, 3000);
  }
}



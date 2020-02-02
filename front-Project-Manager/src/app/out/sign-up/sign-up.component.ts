import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  returnUrl: string;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
    this.errorMessage = '';
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      passwd: ['', Validators.required],
      passwd2: ['', Validators.required],
      school: ['', Validators.required],
      schoolYear: ['', Validators.required],
      birth: ['', Validators.required]
    });

    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {

    const email = this.signUpForm.get('email').value;
    const name = this.signUpForm.get('name').value;
    const lastName = this.signUpForm.get('lastName').value;
    const password = this.signUpForm.get('passwd').value;
    const password2 = this.signUpForm.get('passwd2').value;
    const school = this.signUpForm.get('school').value;
    const schoolYear = this.signUpForm.get('schoolYear').value;
    const birth = this.signUpForm.get('birth').value;

    console.log(email, name, lastName, password, password2, school, schoolYear, birth);

    if (password === password2) {
      this.authService.register(email, name, lastName, password, school, schoolYear, birth)
        .subscribe(data => {
          console.log(data);
          this.router.navigate(['/in/groups']);
        }, err => {
          console.error('Subscription failed');
          this.errorMessage = err.error.message;
        });
    } else {
      this.errorMessage = 'The passwords are different';
      console.error('Wrong password');
    }
  }



}

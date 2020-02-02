import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;

  userToken: { access_token: string };

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
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwd: ['', Validators.required]
    });

    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {

    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('passwd').value;
    this.authService.login(email, password)
      .subscribe(data => {
        this.userToken = data;
        console.log(data);
        this.router.navigate(['/in/groups']);
        this.userToken = null;
      }, err => {
        console.log(err);
        this.errorMessage = err.error.message;
      });
  }

}

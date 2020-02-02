import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../models/user.model';
import {Router} from '@angular/router';
import {SearchHeaderService} from '../../../services/search-header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  searchForm: FormGroup;

  searchTxt = '';

  showProfileMenu = false;
  showBurgerMenu = false;
  hoverFirstChildElement = false;

  constructor(private formBuilder: FormBuilder ,
              private router: Router,
              private searchHeaderService: SearchHeaderService) {}


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.initForm();
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      search: ''
    });
  }

  onSearchContentChange(event) {
    if (event.data) {
      this.searchTxt += event.data;
    } else {
      this.searchTxt = this.searchTxt.slice(0, this.searchTxt.length - 1);
    }
    this.searchHeaderService.changeSearchHeaderContent(this.searchTxt);
  }

  onSubmit() {
    const search = this.searchForm.get('search').value;
    this.searchHeaderService.changeSearchHeaderContent(search);
  }

  // Used to colorize dropdown-arrow element on mouseover first dropdown-profile element
  onHoverFirstChildElement() {
    this.hoverFirstChildElement = !this.hoverFirstChildElement;
  }

  onShowProfileMenu() {
    if (!this.showBurgerMenu) {
      console.log('heyyyy');
      this.showProfileMenu = !this.showProfileMenu;
    }
    console.log(this.showProfileMenu);
  }

  onSetProfileMenuActive() {
    if (!this.showBurgerMenu) {
      this.showProfileMenu = true;
    }
  }

  onSetProfileMenuUnactive() {
    if (!this.showBurgerMenu) {
      this.showProfileMenu = false;
    }
  }

  onClickOnBurger() {
    this.showProfileMenu = true;
    this.showBurgerMenu = !this.showBurgerMenu;
  }

  onLogOut() {
    this.router.navigate(['/out/signin']);
  }
}

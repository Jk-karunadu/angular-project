import { Component } from '@angular/core';
import { SellerService } from '../sellerservice/seller.service';
import { Router } from '@angular/router';
import { login, SignUp } from '../datatype';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'] // Ensure the correct styleUrls property name
})
export class UserLoginComponent {
  authError: string = '';
  showlogin = true;
  userlogin = true;

  constructor(private seller: SellerService, private router: Router) {}

  toggle(s: string) {
    console.log(this.showlogin);
    this.showlogin = !this.showlogin;
  }

  signUp(data: SignUp) {
    this.seller.userSignUp(data);
    this.userlogin = false;
    console.warn(data);
  }

  login(data: login) {
    this.authError = '';
    this.seller.userLogin(data);
    this.seller.isuserLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'email or password incorrect';
      } else {
        this.userlogin = false;
      }
    });
    console.warn(data);
  }

  ngOnInit(): void {
    this.seller.reloaduser();
  }
}

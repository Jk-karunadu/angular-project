import { Component } from '@angular/core';
import { FormsModule, NgForm, AbstractControl } from '@angular/forms';
import { SellerService } from '../../sellerservice/seller.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { login, SignUp } from '../../datatype';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})
export class SellerComponent {
  authError: string = '';
  showlogin = true;

  constructor(private seller: SellerService, private router: Router) {}

  toggle(s: string) {
    this.showlogin = !this.showlogin;
  }

  // Custom Password Validator
  validatePassword(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#\$%\^&\*]/.test(value);
    const isValidLength = value.length >= 8;

    if (hasUppercase && hasNumber && hasSpecialChar && isValidLength) {
      return null; // Valid password
    }

    return { passwordStrength: true }; // Invalid password
  }

  signUp(form: NgForm) {
    const passwordControl = form.controls['password'];
    const passwordValidation = this.validatePassword(passwordControl);
    console.warn("entered signup");

    if (passwordValidation) {
      passwordControl.setErrors(passwordValidation);
    } else {
      this.seller.sellerSignUp(form.value);
      console.warn(form.value);
    }
  }

  login(form: NgForm) {
    this.authError = '';
    this.seller.sellerLogin(form.value);
    this.seller.issellerLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'email or password incorrect';
      }
    });
    console.warn(form.value);
  }

  ngOnInit(): void {
    this.seller.reloadSeller();
  }
}

import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { login, Product, SignUp } from '../datatype';
import { Router } from '@angular/router';
import { environment } from '../../../environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  issellerLoginError = new EventEmitter<boolean>(false);
  isuserLoginError = new EventEmitter<boolean>(false);

  private cartLengthSubject = new BehaviorSubject<number>(0);
  cartLength$ = this.cartLengthSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  updateCartLength(length: number): void {
    this.cartLengthSubject.next(length);
  }

  sellerSignUp(data: SignUp): void {
    this.http.post(`${environment.backendUrl}/seller`, data, { observe: 'response' })
      .subscribe((res) => {
        localStorage.setItem('seller', JSON.stringify(res.body));
        this.router.navigate(['seller-home']);
      });
  }

  userSignUp(data: SignUp): void {
    this.http.post(`${environment.backendUrl}/user`, data, { observe: 'response' })
      .subscribe((res) => {
        localStorage.setItem('user', JSON.stringify(res.body));
        this.router.navigate(['']);
      });
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${environment.backendUrl}/products`, data, { observe: 'response' });
  }

  sellerLogin(data: login): void {
    this.http.get(`${environment.backendUrl}/seller?email=${data.email}&password=${data.password}`, { observe: 'response' })
      .subscribe((res: any) => {
        if (res && res.body && res.body.length) {
          localStorage.setItem('seller', JSON.stringify(res.body));
          this.router.navigate(['seller-home']);
        } else {
          alert('Login failed, incorrect email or password.');
          this.issellerLoginError.emit(true);
        }
      });
  }

  userLogin(data: login): void {
    this.http.get(`${environment.backendUrl}/user?email=${data.email}&password=${data.password}`, { observe: 'response' })
      .subscribe((res: any) => {
        if (res && res.body && res.body.length) {
          localStorage.setItem('user', JSON.stringify(res.body));
          this.router.navigate(['']);
        } else {
          alert('Login failed, incorrect email or password.');
          this.isuserLoginError.emit(true);
        }
      });
  }

  getproducts(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/products`);
  }

  getbuy(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/buy`);
  }

  searchprod(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.backendUrl}/products?q=${query}`);
  }

  getcart(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/cart`);
  }

  getproductshome(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/products`);
  }

  getorders(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/order`);
  }

  getslider(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/carousel?_limit=4`);
  }

  delproduct(data: any): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/products/${data}`);
  }

  delcart(data: any): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/cart/${data}`);
  }

  delorders(data: any): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/order/${data}`);
  }

  delbuy(data: any): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/buy/${data}`);
  }

  getupdate(id: any): Observable<any> {
    return this.http.get(`${environment.backendUrl}/products?id=${id}`);
  }

  addtocart(product: any): Observable<any> {
    return this.http.post(`${environment.backendUrl}/cart`, product);
  }

  addtobuy(product: any): Observable<any> {
    return this.http.post(`${environment.backendUrl}/buy`, product);
  }

  orderdetails(product: any): Observable<any> {
    return this.http.post(`${environment.backendUrl}/order`, product);
  }

  updateproduct(data: any, id: any): Observable<any> {
    return this.http.put(`${environment.backendUrl}/products/${id}`, data);
  }

  reloadSeller(): void {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    } else {
      this.router.navigate(['seller']);
    }
  }

  reloaduser(): void {
    if (localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['']);
    } else {
      this.router.navigate(['user-login']);
    }
  }
}

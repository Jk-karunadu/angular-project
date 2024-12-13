import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../sellerservice/seller.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { Product } from '../datatype';
import { ActivatedRoute } from '@angular/router';  // Corrected ActivatedRoute import
import { AnyPtrRecord } from 'dns';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModule, FormsModule],  // Removed ActivatedRoute and NgModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menutype: string = 'default';
  sellername: string = '';
  userlogin = true;
  username: string = '';
  searchQuery: string = '';  // Variable to hold search input
  cartlength: any;
  searchResults: any[] = [];  // To hold search results

  constructor(private router: Router, private seller: SellerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if we are in the browser environment before using localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Subscribe to cart length changes
      this.seller.cartLength$.subscribe((length) => {
        this.cartlength = length;
      });
    
      // Listen to router events
      this.router.events.subscribe((val: any) => {
        if (val.url) {
          // Handling seller menu type
          if (localStorage.getItem('seller') && val.url.includes('seller')) {
            this.menutype = 'seller';
    
            // Fetching seller data from localStorage
            const sellerstore = localStorage.getItem('seller');
            const sellerdata = sellerstore && JSON.parse(sellerstore);
            this.sellername = sellerdata?.name || '';
    
            console.warn("seller:", sellerdata);
            console.warn("sellername", this.sellername);
    
          } else if (localStorage.getItem('user')) {
            // Handling user menu type
            this.menutype = 'user';
    
            // Fetching user data from localStorage
            const userstore = localStorage.getItem('user');
            const userdata = userstore && JSON.parse(userstore);
            this.username = userdata?.name || '';
    
            console.warn("user:", userdata);
            console.warn("username", this.username);
    
            this.userlogin = false;
    
          } else {
            // Default menu type
            this.menutype = 'default';
          }
        }
      });
    }
  }
  
  // Function to handle search based on user input
  searchproduct(): void {
    if (this.menutype == 'seller') {
      if (this.searchQuery.trim() !== '') {
        this.seller.searchprod(this.searchQuery).subscribe((res: Product[]) => {
          // Further filter results based on the searchQuery
          this.searchResults = res.filter((product: Product) =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          console.log('Filtered Search Results:', this.searchResults);
        });
      }

      if (this.searchResults.length > 5) {
        this.searchResults.length = 5;
      }

      if (this.searchQuery) {
        this.router.navigate([`search-seller/${this.searchQuery}`]);
      } else {
        this.router.navigate(['seller-home']);
      }

    } else {
      if (this.searchQuery.trim() !== '') {
        this.seller.searchprod(this.searchQuery).subscribe((res: Product[]) => {
          // Further filter results based on the searchQuery
          this.searchResults = res.filter((product: Product) =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          console.log('Filtered Search Results:', this.searchResults);
        });
      }

      if (this.searchResults.length > 5) {
        this.searchResults.length = 5;
      }

      if (this.searchQuery) {
        this.router.navigate([`search-products/${this.searchQuery}`]);
      } else {
        this.router.navigate(['']);
      }
    }
  }

  hidesearch() {
    this.searchResults = [];
  }

  // Submit handler for search form
  onSearch(event: Event): void {
    event.preventDefault();  // Prevents form submission and page reload
    this.searchproduct();     // Call searchproduct to fetch and display results
  }

  logout(): void {
    // Check for localStorage before using it
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('seller');
      this.router.navigate(['']);
    }
  }

  userlogout(): void {
    // Check for localStorage before using it
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
      this.router.navigate(['']);
      this.userlogin = true;
    }
  }

  sellerSignUp(data: any): void {
    this.seller.sellerSignUp(data).subscribe((res: any) => {
      if (res && res.body) {
        // Handle successful signup
        localStorage.setItem('seller', JSON.stringify(res.body));
        this.router.navigate(['seller-home']);
      }
    });
  }
}

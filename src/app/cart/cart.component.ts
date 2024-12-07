import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CartProduct } from '../shared/models/cart-product';
import { CartProductLoadingComponent } from './components/cart-product-loading/cart-product-loading.component';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { PaymentService } from '../core/services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    CartProductComponent,
    CartProductLoadingComponent,
    CurrencyPipe,
    NgOptimizedImage,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts?: CartProduct[];
  total: number = 0;

  paymentService = inject(PaymentService);
  showErrorToast = false;

  ngOnInit(): void {
    this.updateTotal();
  }

  updateTotal() {
    const storagedProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];

    this.cartProducts = storagedProducts;

    let total = 0;

    this.cartProducts.forEach((cartProduct) => {
      total +=
        Math.round(cartProduct.product.price * cartProduct.quantity * 100) /
        100;
    });

    this.total = total;
  }

  proceedToCheckout() {
    if (this.cartProducts && this.cartProducts.length > 0) {
      this.paymentService
        .checkout({ total: this.total, products: this.cartProducts })
        .subscribe({
          next: (data) => {
            location.href = data.checkoutUrl;
          },
          error: (err: HttpErrorResponse) => {
            this.showErrorToast = true;
          },
        });
    }
  }
}

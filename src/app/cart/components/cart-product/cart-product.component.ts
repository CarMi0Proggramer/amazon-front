import { Component, input, OnInit, output, signal } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../../../shared/models/cart-product';

@Component({
  selector: 'app-cart-product',
  imports: [CurrencyPipe],
  templateUrl: './cart-product.component.html',
})
export class CartProductComponent implements OnInit {
  product = input.required<Product>();
  quantity = input.required<number>();
  quantitySignal = signal<number>(0);
  quantityUpdatedEvent = output();

  ngOnInit(): void {
    this.quantitySignal.set(this.quantity());
  }

  removeProduct() {
    const storagedProducts: CartProduct[] = JSON.parse(
      localStorage.getItem('cart-products') as string
    );
    const filteredProducts = storagedProducts.filter(
      (cartProduct) => cartProduct.product.id !== this.product().id
    );

    localStorage.setItem('cart-products', JSON.stringify(filteredProducts));

    this.quantityUpdatedEvent.emit();
  }

  incrementQuantity() {
    this.quantitySignal.update((value) => value + 1);

    const storagedProducts: CartProduct[] = JSON.parse(
      localStorage.getItem('cart-products') as string
    );
    const cartProduct = storagedProducts.find(
      (cartProduct) => cartProduct.product.id === this.product().id
    ) as CartProduct;
    cartProduct.quantity++;

    localStorage.setItem('cart-products', JSON.stringify(storagedProducts));

    this.quantityUpdatedEvent.emit();
  }

  decrementQuantity() {
    if (this.quantitySignal() == 1) return;

    this.quantitySignal.update((value) => value - 1);

    const storagedProducts: CartProduct[] = JSON.parse(
      localStorage.getItem('cart-products') as string
    );
    const cartProduct = storagedProducts.find(
      (cartProduct) => cartProduct.product.id === this.product().id
    ) as CartProduct;
    cartProduct.quantity--;

    localStorage.setItem('cart-products', JSON.stringify(storagedProducts));

    this.quantityUpdatedEvent.emit();
  }
}

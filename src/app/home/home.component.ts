import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { ProductsService } from '../core/services/product.service';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { RouterLink } from '@angular/router';
import { HomeProductLoadingComponent } from "./components/home-product-loading/home-product-loading.component";

@Component({
  selector: 'app-home',
  imports: [ProductOfferComponent, HomeProductComponent, RouterLink, HomeProductLoadingComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  productsService = inject(ProductsService);
  products?: Product[];
  productsOffers?: Product[];

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
      this.productsOffers = this.products.filter(
        (product) => product.previousPrice
      );

      setTimeout(() => {
        initFlowbite();
      }, 200);
    });
  }
}

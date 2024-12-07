export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  reviews: number;
  previousPrice: number | null;
  urlImg: string;
}

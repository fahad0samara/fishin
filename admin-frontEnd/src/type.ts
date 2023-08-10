

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: {
    _id: string;
    name: string;
    description: string;
    __v: number;
  };
  description: string;
  images: string[];
  reviews: any[]; // You can replace this with the actual review type if available
  brand: string;
  colors: {
    _id: string;
    code: string;
    name: string;
    __v: number;
  }[];
  sizes: {
    _id: string;
    name: string;
    __v: number;
  }[];
  availability: boolean;
  __v: number;
}

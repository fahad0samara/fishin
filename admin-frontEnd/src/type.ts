export interface Color {
  _id: string;
  name: string;
  code: string;
}

export interface Size {
  _id: string;
  name: string;
}

export interface FormData {
  name: string;
  price: number;
  category: string;
  description: string;
  images: File[];
  brand: string;
  selectedColors: string[];
  selectedSizes: string[];
}

export interface reviews {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    __v: number;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  reviews: reviews[];
  brand: string;
  colors: {
    _id: string;
    code: string;
    name: string;
    __v: number;
  }[];
  sizes: Size[];

  availability: boolean;
  __v: number;
}

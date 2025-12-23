
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export enum Category {
  STARTERS = 'Starters',
  MAINS = 'Mains',
  DESSERTS = 'Desserts',
  DRINKS = 'Drinks',
  SPECIALS = 'Specials'
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export interface MenuPage {
  id: string;
  imageUrl: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountAmount?: string;
  imageUrl?: string;
}

export interface RestaurantSettings {
  days: string;
  hours: string;
  logoUrl?: string;
}
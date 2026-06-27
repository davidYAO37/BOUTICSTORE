import { Document, Types } from "mongoose";

export type Locale = "fr" | "en";

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  description?: LocalizedString;
  country?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: LocalizedString;
  slug: string;
  description?: LocalizedString;
  image?: string;
  icon?: string;
  parent?: Types.ObjectId | ICategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStore extends Document {
  _id: Types.ObjectId;
  name: LocalizedString;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  whatsapp?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours?: LocalizedString;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpecification {
  label: string;
  value: string;
  unit?: string;
  category?: string;
}

export interface IMotorcycle extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  reference: string;
  brand: Types.ObjectId | IBrand;
  category: Types.ObjectId | ICategory;
  description: LocalizedString;
  shortDescription: LocalizedString;
  price: number;
  oldPrice?: number;
  currency: string;
  stock: number;
  availability: "in_stock" | "out_of_stock" | "pre_order" | "coming_soon";
  year: number;
  color: string[];
  displacement: number;
  transmission: string;
  engineType?: string;
  power?: string;
  torque?: string;
  weight?: string;
  seatHeight?: string;
  fuelCapacity?: string;
  consumption?: string;
  images: string[];
  thumbnail: string;
  video?: string;
  specifications: ISpecification[];
  features: LocalizedString[];
  warranty: string;
  isPromotion: boolean;
  isNew: boolean;
  isPopular: boolean;
  isActive: boolean;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "sales" | "warehouse" | "customer";
  isActive: boolean;
  emailVerified: boolean;
  avatar?: string;
  favorites: Types.ObjectId[];
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  label: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface IOrderItem {
  motorcycle: Types.ObjectId | IMotorcycle;
  quantity: number;
  color?: string;
  price: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  items: IOrderItem[];
  total: number;
  status: "pending" | "confirmed" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: IAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuote extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motorcycle: Types.ObjectId | IMotorcycle;
  message?: string;
  status: "pending" | "processing" | "sent" | "accepted" | "rejected";
  price?: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestRide extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motorcycle: Types.ObjectId | IMotorcycle;
  store?: Types.ObjectId | IStore;
  preferredDate: Date;
  preferredTime: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  motorcycle: Types.ObjectId | IMotorcycle;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  motorcycleId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  thumbnail: string;
  slug: string;
}

export interface FinancingPlan {
  months: number;
  downPayment: number;
  monthlyPayment: number;
  total: number;
  interestRate: number;
}

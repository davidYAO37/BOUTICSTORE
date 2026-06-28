import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID MongoDB invalide");

export const localizedStringSchema = z.object({
  fr: z.string().min(1, "Le texte en français est requis"),
  en: z.string().min(1, "Le texte en anglais est requis"),
});

export const optionalLocalizedStringSchema = z.object({
  fr: z.string().default(""),
  en: z.string().default(""),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Le nom de la marque est requis"),
  slug: z.string().min(1, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide"),
  logo: z.string().optional(),
  description: optionalLocalizedStringSchema.optional(),
  country: z.string().optional(),
  website: z.string().url().or(z.literal("")).optional(),
  isActive: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: localizedStringSchema,
  slug: z.string().min(1, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide"),
  description: optionalLocalizedStringSchema.optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  parent: objectIdSchema.optional().nullable(),
  isActive: z.boolean().optional(),
});

export const storeSchema = z.object({
  name: localizedStringSchema,
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  whatsapp: z.string().optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  openingHours: optionalLocalizedStringSchema.optional(),
  isActive: z.boolean().optional(),
});

export const specificationSchema = z.object({
  label: z.string().min(1, "Le label est requis"),
  value: z.string().min(1, "La valeur est requise"),
  unit: z.string().optional(),
  category: z.string().optional(),
});

export const motorcycleSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide"),
  reference: z.string().min(1, "La référence est requise"),
  brand: objectIdSchema,
  category: objectIdSchema,
  description: localizedStringSchema,
  shortDescription: localizedStringSchema,
  price: z.number().min(0, "Le prix doit être positif"),
  oldPrice: z.number().min(0).optional().nullable(),
  currency: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  availability: z.enum(["in_stock", "out_of_stock", "pre_order", "coming_soon"]).optional(),
  year: z.number().int().min(1900).max(2100),
  color: z.array(z.string()).min(1, "Au moins une couleur est requise"),
  displacement: z.number().min(0, "La cylindrée doit être positive"),
  transmission: z.string().min(1, "La transmission est requise"),
  engineType: z.string().optional(),
  power: z.string().optional(),
  torque: z.string().optional(),
  weight: z.string().optional(),
  seatHeight: z.string().optional(),
  fuelCapacity: z.string().optional(),
  consumption: z.string().optional(),
  images: z.array(z.string().min(1)).min(1, "Au moins une image est requise"),
  thumbnail: z.string().min(1, "La miniature est requise"),
  video: z.string().optional(),
  datasheet: z.string().optional(),
  specifications: z.array(specificationSchema).optional(),
  features: z.array(localizedStringSchema).optional(),
  warranty: z.string().optional(),
  isPromotion: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  metaTitle: optionalLocalizedStringSchema.optional(),
  metaDescription: optionalLocalizedStringSchema.optional(),
});

export const userSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().optional(),
  role: z.enum(["admin", "sales", "warehouse", "customer"]).optional(),
  isActive: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const orderSchema = z.object({
  user: objectIdSchema,
  items: z.array(
    z.object({
      motorcycle: objectIdSchema,
      quantity: z.number().int().min(1),
      color: z.string().optional(),
      price: z.number().min(0),
    })
  ).min(1, "Au moins un article est requis"),
  total: z.number().min(0),
  status: z.enum(["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled"]).optional(),
  paymentMethod: z.string().min(1, "Le mode de paiement est requis"),
  shippingAddress: z.object({
    label: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
    isDefault: z.boolean().optional(),
  }),
  notes: z.string().optional(),
});

export const quoteSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  motorcycle: objectIdSchema,
  message: z.string().optional(),
  status: z.enum(["pending", "processing", "sent", "accepted", "rejected"]).optional(),
  price: z.number().min(0).optional().nullable(),
  adminNotes: z.string().optional(),
});

export const testRideSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  motorcycle: objectIdSchema,
  store: objectIdSchema.optional().nullable(),
  preferredDate: z.string().min(1, "La date est requise"),
  preferredTime: z.string().min(1, "L'heure est requise"),
  message: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
});

export const reviewSchema = z.object({
  user: objectIdSchema,
  motorcycle: objectIdSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, "Le titre est requis"),
  comment: z.string().min(1, "Le commentaire est requis"),
  images: z.array(z.string()).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(1, "Le message est requis"),
});

export type BrandInput = z.infer<typeof brandSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type StoreInput = z.infer<typeof storeSchema>;
export type MotorcycleInput = z.infer<typeof motorcycleSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type TestRideInput = z.infer<typeof testRideSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

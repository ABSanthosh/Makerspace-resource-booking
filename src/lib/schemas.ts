import {
  BookingStatus,
  ESecondaryStatus,
  EStatus,
  ProfileType,
  Role,
  type Equipment,
  type ECategories,
  type Manual,
  type Video,
  type BookingItem,
  type CartItem
} from '@prisma/client';
import { z } from 'zod';

const phoneRegex = new RegExp(/(\+91\s)?\d{10}/);

const studentZSchema = z.object({
  yearOfStudy: z.number().min(1),
  branch: z.string().min(2),
  department: z.string().min(2),
  studentId: z.string().min(2),
  clubs: z.array(z.string()).optional()
});

const facultyZSchema = z.object({
  department: z.string().min(2),
  branch: z.string().min(2),
  designation: z.string().min(2),
  facultyId: z.string().min(2)
});

const staffZSchema = z.object({
  department: z.string().min(2),
  branch: z.string().min(2),
  designation: z.string().min(2),
  staffId: z.string().min(2)
});

const profileSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(ProfileType.STUDENT),
    typeData: studentZSchema
  }),
  z.object({
    type: z.literal(ProfileType.FACULTY),
    typeData: facultyZSchema
  }),
  z.object({
    type: z.literal(ProfileType.STAFF),
    typeData: staffZSchema
  })
]);

export const UserProfileZodSchema = z
  .object({
    name: z.string().min(2),
    mobile: z.string().regex(phoneRegex, { message: 'Invalid phone number' }),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    isNew: z.boolean()
  })
  .and(profileSchema);

export type UserProfileSchema = z.infer<typeof UserProfileZodSchema>;

export enum WeekDaysEnum {
  Su = 'SU',
  M = 'MO',
  T = 'TU',
  W = 'WE',
  Th = 'TH',
  F = 'FR',
  Sa = 'SA'
}

export const EItemZodSchema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(2),
  equipmentId: z.string(),
  description: z.string().optional().or(z.literal('')),
  status: z.nativeEnum(EStatus).default(EStatus.available).optional(),
  cost: z.string().min(1).default('0'),
  secondaryStatus: z.nativeEnum(ESecondaryStatus).default(ESecondaryStatus.ACTIVE).optional(),
  availability: z.object({
    starts: z.string(),
    ends: z.string(),
    repeat: z
      .array(z.nativeEnum(WeekDaysEnum))
      .describe('The days of the week the instance is available.'),
    maxOffset: z
      .number()
      .optional()
      .default(1)
      .describe(
        'The maximum number of months from today that the instance can be booked in advance.'
      )
    // interval: z.number().optional().default(30).describe('The step in minutes for the time picker.'),
  })
});

export type EItemSchema = z.infer<typeof EItemZodSchema>;

export const EZodSchema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(2),
  model: z.string().min(2),
  image: z
    .custom<File>((f) => f instanceof File, 'Please upload a file.')
    .refine(
      (f) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
    .refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
    .or(z.string()),
  description: z.string().optional().default(''),
  eCategoriesId: z.string().min(7, { message: 'Category is required' }),
  // isDeleted: z.boolean().optional().or(z.literal(false))
  secondaryStatus: z.nativeEnum(ESecondaryStatus)
});

export type ESchema = z.infer<typeof EZodSchema>;

export const EManualZSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  pdf: z
    .custom<File>((f) => f instanceof File, 'Please upload a file.')
    .refine((f) => f.type === 'application/pdf', 'Only PDF files are accepted.')
    .or(z.string().trim().url()),
  equipmentId: z.string().min(7)
});

export type EManualSchema = z.infer<typeof EManualZSchema>;

export const EManualCRUDZSchema = z.object({
  add: z.array(EManualZSchema),
  delete: z.array(z.string())
});

export type EManualCRUDSchema = z.infer<typeof EManualCRUDZSchema>;

export const EVideoZSchema = z.object({
  id: z.string(),
  video: z.string().trim().url(),
  equipmentId: z.string().min(7)
});

export type EVideoSchema = z.infer<typeof EVideoZSchema>;

export const EVideoCRUDZSchema = z.object({
  add: z.array(EVideoZSchema),
  delete: z.array(z.string())
});

export type EVideoCRUDSchema = z.infer<typeof EVideoCRUDZSchema>;

export const ECategoriesZSchema = z.object({
  id: z.string(),
  name: z.string().min(2)
});

export type ECategoriesSchema = z.infer<typeof ECategoriesZSchema>;

export const ECategoryCRUDZSchema = z.object({
  add: z.array(ECategoriesZSchema),
  edit: z.array(ECategoriesZSchema),
  delete: z.array(z.string())
});

export type ECategoryCRUDSchema = z.infer<typeof ECategoryCRUDZSchema>;

export const CartItemZSchema = z.object({
  end: z.string(), // will be string of date object
  start: z.string(), // will be string of date object
  instanceId: z.string(),
  equipmentId: z.string(),
  id: z.string().optional().or(z.literal('')),
  userId: z.string().optional().or(z.literal(''))
});

export type CartItemSchema = z.infer<typeof CartItemZSchema>;

export const CartZSchema = z.object({
  userId: z.string(),
  items: z.array(CartItemZSchema),
  status: z.nativeEnum(BookingStatus),
  id: z.string().optional().or(z.literal(''))
});

export type CartSchema = z.infer<typeof CartZSchema>;

export const CartDeleteZSchema = z.object({
  ids: z.array(z.string())
});
export type CartDeleteSchema = z.infer<typeof CartDeleteZSchema>;

export const BookingZSchema = z.object({
  userId: z.string(),
  mentor: z.string().min(2),
  description: z.string().min(2),
  deadline: z.date(),
  cartId: z.string(),
  instances: z.array(z.string()),
  adminNotes: z.string().optional().or(z.literal(''))
});

export type BookingSchema = z.infer<typeof BookingZSchema>;

export const BookingCancelZSchema = z.object({
  bookingId: z.string().min(2)
});

export const BookingUpdateZSchema = z.object({
  bookingId: z.string().min(2),
  status: z.nativeEnum(BookingStatus),
  adminNotes: z.string().optional().or(z.literal(''))
});

export type BookingUpdateSchema = z.infer<typeof BookingUpdateZSchema>;

export type BookingCancelSchema = z.infer<typeof BookingCancelZSchema>;

export const CMSZSchema = z.object({
  id: z.string(),
  data: z.string()
});

export type CMSSchema = z.infer<typeof CMSZSchema>;

export type EquipmentById = Equipment & {
  category: ECategories;
  manuals: Manual[];
  videos: Video[];
  instances: (EItemSchema & {
    BookingItem: (BookingItem & {
      booking: {
        status: BookingStatus;
      };
    })[];
    CartItem: CartItem[];
  })[];
};

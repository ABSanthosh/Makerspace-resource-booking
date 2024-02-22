import { BookingStatus, EStatus, Role } from '@prisma/client';
import { z } from 'zod';

const phoneRegex = new RegExp(/(\+91\s)?\d{10}/);

export const UserProfileZodSchema = z.object({
	name: z.string().min(2),
	mobile: z.string().regex(phoneRegex, { message: 'Invalid phone number' }),
	email: z.string().email(),
	department: z.string().min(2),
	branch: z.string().min(2),
	userId: z.string().min(2),
	year: z.number().min(4),
	role: z.nativeEnum(Role),
	isNew: z.boolean().optional(),
	clubs: z.array(z.string()).optional()
});

export type UserProfileSchema = z.infer<typeof UserProfileZodSchema>;

export const EItemZodSchema = z.object({
	id: z.string().optional().or(z.literal('')),
	name: z.string().min(2),
	description: z.string().optional().or(z.literal('')),
	status: z.nativeEnum(EStatus),
	cost: z.string().min(1).default('0'),
	isDeleted: z.boolean().optional().or(z.literal(false))
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
	instances: z.array(EItemZodSchema),
	eCategoriesId: z.string().min(7, { message: 'Category is required' }),
	isDeleted: z.boolean().optional().or(z.literal(false))
});

export type ESchema = z.infer<typeof EZodSchema>;

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
	end: z.date(),
	start: z.date(),
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

// mentor - text
// description - text (course, our, research, etc)
// deadline for the project
export const BookingZSchema = z.object({
	mentor: z.string().min(2),
	description: z.string().min(2),
	deadline: z.date(),
	instances: z.array(z.string())
});

export type BookingSchema = z.infer<typeof BookingZSchema>;

export const CMSZSchema = z.object({
	id: z.string(),
	data: z.string()
});

export type CMSSchema = z.infer<typeof CMSZSchema>;

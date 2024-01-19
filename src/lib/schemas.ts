import { EStatus } from '@prisma/client';
import { z } from 'zod';

const phoneRegex = new RegExp(/(\+91\s)?\d{10}/);

// userId
// string of numbers for emp id
// OTP for mail
// For students just netid and roll number
// For faculty just netid and emp id

// Need in register page
// User category
// first name, last name

export const EItemZodSchema = z.object({
	id: z.string().optional().or(z.literal('')),
	name: z.string().min(2),
	description: z.string().optional().or(z.literal('')),
	status: z.nativeEnum(EStatus),
	cost: z.string().min(1).default('0')
});

export type EItemSchema = z.infer<typeof EItemZodSchema>;

export const EZodSchema = z.object({
	id: z.string().optional().or(z.literal('')),
	name: z.string().min(2),
	model: z.string().min(2),
	// string needed for addEquipment function parameter image type
	image: z.instanceof(File).or(z.string().min(2)),
	description: z.string().optional().default(''),
	instances: z.array(EItemZodSchema),
	eCategoriesId: z.string().min(7)
});

export type ESchema = z.infer<typeof EZodSchema>;

export const ECategoriesZSchema = z.object({
	id: z.string(),
	name: z.string().min(2)
});

export type ECategoriesSchema = z.infer<typeof ECategoriesZSchema>;

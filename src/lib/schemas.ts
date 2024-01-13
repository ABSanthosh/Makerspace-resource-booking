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


export const equipmentItemSchema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(2),
  description: z.string().optional().or(z.literal('')),
})

export type EquipmentItemSchema = z.infer<typeof equipmentItemSchema>;

export const newEquipmentSchema = z.object({
  id: z.string().optional().or(z.literal('')),
  name: z.string().min(2),
  model: z.string().min(2),
  image: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  equipment: z.array(equipmentItemSchema)
})

export type NewEquipmentSchema = z.infer<typeof newEquipmentSchema>;

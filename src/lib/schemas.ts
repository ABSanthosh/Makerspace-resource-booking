// import { UserCategory } from '@prisma/client';
// import { z } from 'zod';

// const phoneRegex = new RegExp(/(\+91\s)?\d{10}/);

// const passwordValidator = z
//   .string()
//   .min(7, 'at least 7 characters long')
//   .refine((password) => /[a-z]/.test(password), {
//     message: 'contain at least one lower case letter'
//   })
//   .refine((password) => /[A-Z]/.test(password), {
//     message: 'contain at least one upper case letter'
//   })
//   .refine((password) => /\d/.test(password), {
//     message: 'contain at least one number'
//   })
//   .refine((password) => /[@$!%*#?&]/.test(password), {
//     message: 'contain at least one special character'
//   });

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: passwordValidator
// });

// export type LoginSchema = typeof loginSchema;

// export const registerSchema = z.object({
//   userCategory: z.enum(Object.keys(UserCategory) as [string]),
//   firstName: z.string().min(2),
//   lastName: z.string().min(2),
//   orgName: z.string().min(2),
//   department: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']),
//   userId: z.string().min(2),
//   mobile: z.string().regex(phoneRegex, 'Invalid mobile number'),
//   school: z.enum(['School of Engineering', 'School of Science', 'School of Management']),
//   email: z.string().email(),
//   password: passwordValidator,
//   confirm: z.string()
// }).refine((data) => data.password !== data.confirm, {
//   message: 'Passwords do not match',
//   path: ['confirm']
// })

// // userId
// // string of numbers for emp id
// // OTP for mail
// // For students just netid and roll number
// // For faculty just netid and emp id

// // Need in register page
// // User category
// // first name, last name

// // https://lucia-auth.com/oauth/providers/google/

// export type RegisterSchema = typeof registerSchema;

// export const equipmentItemSchema = z.object({
//   id: z.string().optional().or(z.literal('')),
//   name: z.string().min(2),
//   description: z.string().optional().or(z.literal('')),
// })

// export type EquipmentItemSchema = z.infer<typeof equipmentItemSchema>;

// export const newEquipmentSchema = z.object({
//   id: z.string().optional().or(z.literal('')),
//   name: z.string().min(2),
//   model: z.string().min(2),
//   image: z.string().url().optional().or(z.literal('')),
//   description: z.string().optional(),
//   equipment: z.array(equipmentItemSchema)
// })

// export type NewEquipmentSchema = z.infer<typeof newEquipmentSchema>;

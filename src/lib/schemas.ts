import { z } from 'zod';

const phoneRegex = new RegExp(/(\+91\s)?\d{10}/);

const passwordValidator = z
  .string()
  .min(7, 'at least 7 characters long')
  .refine((password) => /[a-z]/.test(password), {
    message: 'contain at least one lower case letter'
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'contain at least one upper case letter'
  })
  .refine((password) => /\d/.test(password), {
    message: 'contain at least one number'
  })
  .refine((password) => /[@$!%*#?&]/.test(password), {
    message: 'contain at least one special character'
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordValidator
});

export type LoginSchema = typeof loginSchema;

export const registerSchema = z.object({
  userCategory: z.enum(['student', 'professor', 'staff', 'other']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  orgName: z.string().min(2),
  department: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']),
  userId: z.string().min(2),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number'),
  school: z.enum(['School of Engineering', 'School of Science', 'School of Management']),
  email: z.string().email(),
  password: passwordValidator,
  confirm: z.string()
}).refine((data) => data.password !== data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm']
})

export type RegisterSchema = typeof registerSchema; 

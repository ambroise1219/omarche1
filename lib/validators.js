import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category_id: z.number().int().positive()
});

export const userSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user', 'delivery']),
  profile_image_url: z.string().url().optional()
});

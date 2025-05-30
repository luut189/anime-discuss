import { z } from 'zod';

export const passwordRequirements: { label: string; test: (_: string) => boolean }[] = [
    {
        label: 'At least 8 characters',
        test: (password) => password.length >= 8,
    },
    {
        label: 'Contains a number',
        test: (password) => /[0-9]/.test(password),
    },
    {
        label: 'Contains a lowercase letter',
        test: (password) => /[a-z]/.test(password),
    },
    {
        label: 'Contains an uppercase letter',
        test: (password) => /[A-Z]/.test(password),
    },
];

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required.'),
    password: z.string().min(1, 'Password is required.'),
});

export const signupSchema = z
    .object({
        username: z.string().min(2, {
            message: 'Username must be at least 2 characters.',
        }),
        password: z
            .string()
            .refine(
                (password) =>
                    passwordRequirements.every((requirement) => requirement.test(password)),
                {
                    message: 'Password does not meet the requirements.',
                },
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

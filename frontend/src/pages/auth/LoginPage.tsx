import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthStore from '@/store/useAuthStore';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router';

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .refine((password) => /[0-9]/.test(password), {
            message: 'Password must contain at least a number.',
        })
        .refine((password) => /[a-z]/.test(password), {
            message: 'Password must contain at least an alphabet character.',
        })
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Password must contain at least an uppercase character.',
        }),
});

interface IFormItem {
    type: 'username' | 'password';
    placeholder: string;
}

const formItemList: IFormItem[] = [
    { type: 'username', placeholder: 'Username' },
    { type: 'password', placeholder: 'Password' },
];

export default function LoginPage() {
    const { user, login } = useAuthStore();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        login(values);
        if (user) navigate('/');
    }

    return (
        <div className='flex flex-grow items-center justify-center'>
            <Card className='w-1/3'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className='flex flex-col items-center justify-center gap-2'
                            onSubmit={form.handleSubmit(onSubmit)}>
                            {formItemList.map((item, idx) => (
                                <FormField
                                    key={idx}
                                    control={form.control}
                                    name={item.type}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormControl>
                                                <Input
                                                    placeholder={item.placeholder}
                                                    type={
                                                        item.type === 'password' ? 'password' : ''
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button className='w-full' type='submit'>
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className='flex justify-between'>
                    <Label>New to the app?</Label>
                    <Button className='underline' variant={'link'} asChild>
                        <a href='/auth/signup'>Sign up here</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

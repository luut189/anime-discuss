import {
    Form,
    FormLabel,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PasswordRequirement from '@/components/auth/PasswordRequirement';

import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, Path, useForm } from 'react-hook-form';

export interface IFormItem<T> {
    name: Path<T>;
    placeholder: string;
    type?: 'text' | 'password';
}

interface AuthFormProps<T extends z.ZodType> {
    type: 'Login' | 'Sign up';
    schema: T;
    formItems: IFormItem<z.infer<T>>[];
    defaultValues: DefaultValues<z.infer<T>>;
    onSubmit: (_: z.infer<T>) => void;
}

export default function AuthForm<T extends z.ZodType>({
    type,
    schema,
    formItems,
    defaultValues,
    onSubmit,
}: AuthFormProps<T>) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues,
    });
    
    const [password, setPassword] = useState('');

    return (
        <Form {...form}>
            <form
                className='flex flex-col items-center justify-center gap-2'
                onSubmit={form.handleSubmit(onSubmit)}>
                {formItems.map((item, idx) => (
                    <FormField
                        key={idx}
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                            <FormItem className='w-full space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <FormLabel htmlFor={item.name}>{item.placeholder}</FormLabel>
                                    <div className='min-h-[1.25rem]'>
                                        <FormMessage />
                                    </div>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder={item.placeholder}
                                        type={item.type}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (item.name === 'password')
                                                setPassword(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                {type === 'Sign up' && item.name === 'password' ? (
                                    <PasswordRequirement password={password} />
                                ) : null}
                            </FormItem>
                        )}
                    />
                ))}
                <Button className='mt-2 w-full' type='submit'>
                    {type}
                </Button>
            </form>
        </Form>
    );
}

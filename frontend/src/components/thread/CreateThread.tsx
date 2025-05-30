import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/useAuthStore';
import { createThread } from '@/api/thread';
import MarkdownPreview from '@/components/common/MarkdownPreview';
import useSubmit from '@/hooks/useSubmit';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

interface CreateThreadProps {
    id: string;
}

const formSchema = z.object({
    mal_id: z.string(),
    author: z.string(),
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
});

export default function CreateThread({ id }: CreateThreadProps) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mal_id: id,
            author: 'Anonymous',
            title: '',
            content: '',
        },
    });
    const { isSubmitting, onSubmit } = useSubmit(async (data: z.infer<typeof formSchema>) => {
        try {
            await createThread(data, !!user);
            queryClient.invalidateQueries({ queryKey: [`threads-${id}`] });
            form.reset();
            toast.success('Thread created!');
            console.log('Thread created.');
        } catch (error) {
            toast.error('Error creating thread.');
            console.error('Error creating thread:', error);
        }
    });

    useEffect(() => {
        if (user) form.setValue('author', user?.username);
    }, [user, form]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Thread</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-2 p-2'>
                        <div className='flex gap-2'>
                            <FormField
                                control={form.control}
                                name='author'
                                render={({ field }) => (
                                    <FormItem className='w-1/3'>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Anonymous'
                                                {...field}
                                                disabled={!!user}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem className='w-2/3'>
                                        <FormLabel>Thread Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Title' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='How are you feeling?' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <MarkdownPreview content={field.value} />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='ml-auto' disabled={isSubmitting}>
                            {isSubmitting ? <Loader className='animate-spin' /> : 'Create'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

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
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface ReplyThreadProps {
    mal_id: number;
    threadId: string;
    parentCommentId?: string;
    onReplySubmit: () => void;
}

const formSchema = z.object({
    threadId: z.string(),
    parentCommentId: z.string().optional(),
    author: z.string(),
    content: z.string().min(1, { message: 'Content is required' }),
});

export default function ReplyThread({
    mal_id,
    threadId,
    parentCommentId,
    onReplySubmit,
}: ReplyThreadProps) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            threadId: threadId,
            parentCommentId: parentCommentId,
            author: 'Anonymous',
            content: '',
        },
    });

    useEffect(() => {
        if (user) form.setValue('author', user?.username);
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const response = await fetch('/api/thread/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to create comment: ${response.statusText}`);
            }

            const newComment = await response.json();
            toast.success('Replied successfully!');
            console.log('Comment created:', newComment);
        } catch (error) {
            toast.error('Error creating comment.');
            console.error('Error creating comment:', error);
        }
        onReplySubmit();
        queryClient.invalidateQueries({ queryKey: [`threads-${mal_id}`] });
        form.reset();
    }

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Reply Thread</CardTitle>
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
                        </div>
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='What are your thought?' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='ml-auto'>
                            Reply
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

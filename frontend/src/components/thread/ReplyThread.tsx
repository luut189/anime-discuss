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
import { createComment } from '@/api/thread';
import MarkdownPreview from '@/components/common/MarkdownPreview';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import useSubmit from '@/hooks/useSubmit';

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
    }, [user, form]);

    const { isSubmitting, onSubmit } = useSubmit(async (data: z.infer<typeof formSchema>) => {
        try {
            await createComment(data);
            onReplySubmit();
            queryClient.invalidateQueries({ queryKey: [`threads-${mal_id}`] });
            queryClient.invalidateQueries({ queryKey: [`thread-${threadId}`] });
            queryClient.invalidateQueries({ queryKey: [`comments-${threadId}`] });
            form.reset();
            toast.success('Replied successfully!');
            console.log('Comment created.');
        } catch (error) {
            toast.error('Error creating comment.');
            console.error('Error creating comment:', error);
        }
    });

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
                                    <MarkdownPreview content={field.value} />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='ml-auto' disabled={isSubmitting}>
                            {isSubmitting ? <Loader className='animate-spin' /> : 'Reply'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

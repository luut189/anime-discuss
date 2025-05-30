import { loginSchema, signupSchema } from '@/lib/authSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthForm, { IFormItem } from '@/components/auth/AuthForm';
import useAuthNavigate from '@/hooks/useAuthNavigate';
import useAuthStore from '@/store/useAuthStore';

import { z } from 'zod';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const loginFormItems: IFormItem<z.infer<typeof loginSchema>>[] = [
    { name: 'username', placeholder: 'Username', type: 'text' },
    { name: 'password', placeholder: 'Password', type: 'password' },
];

const signupFormItems: IFormItem<z.infer<typeof signupSchema>>[] = [
    { name: 'username', placeholder: 'Username', type: 'text' },
    { name: 'password', placeholder: 'Password', type: 'password' },
    { name: 'confirmPassword', placeholder: 'Confirm Password', type: 'password' },
];

export default function AuthPage() {
    const navigate = useNavigate();
    const { user, login, signup } = useAuthStore();
    const { activeTab, setActiveTab } = useAuthNavigate();

    useEffect(() => {
        if (user) navigate('/');
    });

    async function handleLogin(values: z.infer<typeof loginSchema>) {
        await login(values);
        if (user) navigate('/');
    }

    async function handleSignup(values: z.infer<typeof signupSchema>) {
        await signup(values);
        if (user) navigate('/');
    }

    return (
        <div className='flex flex-grow items-center justify-center'>
            <Card className='w-full sm:w-2/3 md:w-1/2'>
                <CardHeader className='text-center'>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>Sign in to your account or create a new one</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className='w-full'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='login'>Login</TabsTrigger>
                            <TabsTrigger value='signup'>Sign up</TabsTrigger>
                        </TabsList>
                        <TabsContent value='login'>
                            <AuthForm
                                type='Login'
                                schema={loginSchema}
                                formItems={loginFormItems}
                                defaultValues={{
                                    username: '',
                                    password: '',
                                }}
                                onSubmit={handleLogin}
                            />
                        </TabsContent>
                        <TabsContent value='signup'>
                            <AuthForm
                                type='Sign up'
                                schema={signupSchema}
                                formItems={signupFormItems}
                                defaultValues={{
                                    username: '',
                                    password: '',
                                    confirmPassword: '',
                                }}
                                onSubmit={handleSignup}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

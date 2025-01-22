import { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-2 bg-blue-50'>
            <h1 className='text-3xl font-bold'>Vite + React + TS + TailwindCSS</h1>
            <button
                className='rounded-md border bg-slate-50 p-2 shadow-sm hover:bg-slate-100'
                onClick={() => setCount((count) => count + 1)}>
                Count is {count}
            </button>
            <div className='flex flex-col items-center justify-center gap-2 rounded-lg border bg-slate-50 p-5 shadow-sm'>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <p>
                        Edit{' '}
                        <code className='rounded-md bg-slate-200 p-1 shadow-sm'>src/App.tsx</code>{' '}
                        and save to test HMR
                    </p>
                    <p>
                        This template app already includes support for{' '}
                        <span className='font-bold'>shadcn/ui</span> so you can just add new
                        component by
                    </p>
                    <p className='rounded-md bg-slate-200 p-2 shadow-sm'>
                        <code>npx shadcn@latest add {'<component>'}</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

import { CircleX } from 'lucide-react';

interface ErrorFallbackProp {
    errorMessage: string;
}

export default function ErrorFallback({ errorMessage }: ErrorFallbackProp) {
    return (
        <div className='mx-5 flex h-48 flex-col content-center items-center justify-center gap-2 rounded-sm border p-3 text-xl shadow-sm'>
            <CircleX size={32} className='text-red-500' />
            {errorMessage}
        </div>
    );
}

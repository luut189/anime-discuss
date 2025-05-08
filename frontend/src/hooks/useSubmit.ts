import { useCallback, useState } from 'react';

function useSubmit<T>(callback: (_: T) => Promise<void>) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = useCallback(
        async (data: T) => {
            try {
                setIsSubmitting(true);
                await callback(data);
            } finally {
                setIsSubmitting(false);
            }
        },
        [callback],
    );

    return { isSubmitting, onSubmit };
}

export default useSubmit;

import { passwordRequirements } from '@/lib/authSchema';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
    password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
    return (
        <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Password requirements:</p>
            <div className='space-y-1'>
                {passwordRequirements.map((requirement, index) => {
                    const isMet = requirement.test(password);
                    return (
                        <div key={index} className='flex items-center gap-2 text-sm'>
                            {isMet ? (
                                <Check className='h-4 w-4 text-green-500' />
                            ) : (
                                <X className='h-4 w-4 text-red-500' />
                            )}
                            <span className={isMet ? 'text-green-700' : 'text-red-600'}>
                                {requirement.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

function useAuthNavigate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTabState] = useState<string>(
        () => searchParams.get('tab') || 'login',
    );

    useEffect(() => {
        const tab = searchParams.get('tab') || 'login';
        setActiveTabState(tab);
    }, [searchParams]);

    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    return { activeTab, setActiveTab };
}

export default useAuthNavigate;

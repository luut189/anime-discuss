import { Route, Routes } from 'react-router';
import Homepage from '@/pages/Homepage';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<Homepage />} />
        </Routes>
    );
}

import { useState, useCallback } from 'react';
import Home from './ui/pages/home/Home.jsx';
import SplashScreen from './ui/components/generic/splash/SplashScreen.jsx';

const App = () => {
    const [ready, setReady] = useState(false);
    const handleFinish = useCallback(() => setReady(true), []);

    if (!ready) return <SplashScreen onFinish={handleFinish} />;

    return <Home />;
};

export default App;

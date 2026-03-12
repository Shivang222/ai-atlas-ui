import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Search from './pages/Search';
import ToolDetail from './pages/ToolDetail';
import Compare from './pages/Compare';
import Trending from './pages/Trending';
import Dashboard from './pages/Dashboard';

// All routes loaded

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'search',
                element: <Search />,
            },
            {
                path: 'tools/:slug',
                element: <ToolDetail />,
            },
            {
                path: 'compare',
                element: <Compare />,
            },
            {
                path: 'trending',
                element: <Trending />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
        ],
    },
]);

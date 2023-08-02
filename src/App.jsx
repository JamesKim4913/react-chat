// App.jsx
import { useRoutes } from 'react-router-dom';
import './App.css';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateChatRoomPage from './pages/CreateChatRoomPage';
import ChatRoomPage from './pages/ChatRoomPage';
import DashboardPage from './pages/DashboardPage';
import useLocalStorage from './hooks/useLocalStorage';


function App() {

  const [value, setValue] = useLocalStorage('user', null); 

  let element = useRoutes([
    {
      path: '/',
      element: value ? <DashboardPage /> : <SignInPage />
    },
    {
      path: '/signin',
      element: <SignInPage />
    },    
    {
      path: '/signup',
      element: <SignUpPage />
    },   
    {
      path: '/dashboard',
      element: <DashboardPage />
    },    
    {
      path: '/create',
      element: <CreateChatRoomPage />
    },   
    {
      path: '/chat/:roomId',
      element: <ChatRoomPage />
    },            
    {
      path: '*',
      element: <NotFoundPage />
    },    
       
  ])

  return element;
}

export default App
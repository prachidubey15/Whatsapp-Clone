// import { useEffect } from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.scss';

import {Home,Chat,ProfilePage} from './pages/exportPage'
import React from 'react';
import ShowProvider from './context/ShowContext';
import TypingProvider from './context/typingContext';
import SocketProvider from './context/SocketContext';
// import axios from 'axios';

function App() {
 
  return (
    <SocketProvider>
      <TypingProvider>
        <ShowProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path='/profile' element={<ProfilePage />} />
            </Routes>
          </BrowserRouter>
        </ShowProvider>
      </TypingProvider>
    </SocketProvider>
  );
}

export default App;

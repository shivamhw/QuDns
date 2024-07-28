import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import MyDomains from './pages/MyDomains';
import { ddns } from './clients/ddns';
import Checkout from './pages/Checkout';
import { ManageDomain } from './pages/ManageDomain';
import { useUser } from '@clerk/clerk-react';
import ManageToken from './pages/ManageToken';

export type userContext = {
  ddnsClient : ddns | null
  isLoaded: boolean
}
const ddnsClient = ddns.getInstance()

export const UserContext = React.createContext<userContext>({
  ddnsClient: ddnsClient,
  isLoaded: false
});
function App() {
  console.log("this is App compoent")
  const { isLoaded } = useUser()
  return (
    
    <UserContext.Provider value={{ddnsClient: ddnsClient,
    isLoaded: isLoaded}}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/mydomains' element={<MyDomains/>}/>
        <Route path='/checkout' Component={() => (<Checkout />)}/>
        <Route path='/manage' Component={() => (<ManageDomain />)}/>
        <Route path='/token' Component={() => (<ManageToken />)}/>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App

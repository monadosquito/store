import { Main } from './views/pages/main'
import { SignUp } from './views/pages/sign-up'
import { SignIn } from './views/pages/sign-in'
import './App.css';
import React from 'react'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'


const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Main/>}>
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/sign-in' element={<SignIn/>} />
    </Route>
))


const App = () => <RouterProvider router={router} />


export default App;

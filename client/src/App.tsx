import { User, validate } from './server/src/core/user'

import { SignUp } from './views/pages/sign-up'
import { SignIn } from './views/pages/sign-in'
import './App.css';
import React, { useEffect, useState } from 'react'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'


const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/'>
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/sign-in' element={<SignIn/>} />
    </Route>
))


function App() {
    const initUser = {email: '', name_: '', password: ''}

    // return (
    //     <div className="root">
    //         <Form<'user', '/sign-up', User>
    //             validated='user'
    //             endpoint='/sign-up'
    //             initEnt={initUser}
    //         />
    //     </div>
    // );
    return <RouterProvider router={router} />
}


export default App;

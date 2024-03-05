import { Maybe } from './server/src/core/utility'

import { store } from './store'
import { Main } from './views/pages/main'
import { SignUp } from './views/pages/sign-up'
import { SignIn } from './views/pages/sign-in'
import { AddProdCard } from './views/pages/add-prod-card'
import { EditProdCard } from './views/pages/edit-prod-card'
import { ProdCards } from './views/pages/prod-cards'
import { ViewProdCard } from './views/pages/view-prod-card'
import { loadProdCard } from './loader/prod-card'
import { loadProdCards } from './loader/prod-cards'
import { addProdCard } from './action/add-prod-card'
import { editProdCard } from './action/edit-prod-card'
import './App.css';
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'
import { Provider } from 'react-redux'


const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Main/>}>
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/sign-in' element={<SignIn/>} />
        <Route
            path='/product/add'
            element={<AddProdCard/>}
            action={addProdCard}
        />
        <Route
            path='/product/all'
            element={<ProdCards/>}
            loader={loadProdCards}
        />
        <Route
            path="/product/:id"
            element={<ViewProdCard />}
            loader={loadProdCard}
        />
        <Route
            path='/product/edit/:id'
            element={<EditProdCard/>}
            loader={loadProdCard}
            action={editProdCard}
        />
    </Route>
))


const App = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App;

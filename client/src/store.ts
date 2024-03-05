import { Maybe } from './server/src/core/utility'

import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'


type Store = {
    userId: Maybe<number>
}


const initialState: Store = {
    userId: null
}

const slice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        signIn: (state, { payload: userId }) => {
            state.userId = userId
        },
        signOut: state => {
            state.userId = null
        },
    },
})

const store = configureStore({
    reducer: slice.reducer
})


const useAppDispatch = useDispatch.withTypes<AppDispatch>()
const useAppSelector = useSelector.withTypes<State>()

export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export { store, useAppDispatch, useAppSelector }
export const { signIn, signOut } = slice.actions

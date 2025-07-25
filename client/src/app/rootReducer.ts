import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../services/baseApi';
import authReducer from '../features/auth/authSlice';
// import themeReducer from '../features/theme/slice';
// import uiReducer from '../features/ui/slice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
//   theme: themeReducer,
//   ui: uiReducer,
});

export default rootReducer;

// app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
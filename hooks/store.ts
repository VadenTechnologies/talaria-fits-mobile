// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { sneakerApi } from './sneakerApi';

export const store = configureStore({
  reducer: {
    [sneakerApi.reducerPath]: sneakerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sneakerApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { sneakerApi: SneakerApiState }
export type AppDispatch = typeof store.dispatch;
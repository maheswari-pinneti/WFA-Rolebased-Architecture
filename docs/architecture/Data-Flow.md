# Data Flow Architecture

## State Management Pipeline
1. User Action -> Component Trigger
2. Async Thunk Action Dispatch (`createAsyncThunk`)
3. Axios HTTP Client with `authInterceptor` attached (Bearer JWT)
4. REST API Endpoint Execution
5. Redux Slice State Modification (`extraReducers`)
6. Reactive UI Re-render via `useSelector`

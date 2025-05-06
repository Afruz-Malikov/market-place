import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes.tsx';
import './i18n';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
);

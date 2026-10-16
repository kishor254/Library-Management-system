import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { AuthProvider } from '../context/AuthContext';
import { LibraryStoreProvider } from '../context/LibraryStoreContext';
import { BrowserRouter } from 'react-router-dom';

export function renderWithAllProviders(ui) {
  return render(
    <Provider store={store}>
      <AuthProvider>
        <LibraryStoreProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </LibraryStoreProvider>
      </AuthProvider>
    </Provider>
  );
}

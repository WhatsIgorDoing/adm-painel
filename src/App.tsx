import { Navigate, Route, Routes } from 'react-router-dom';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:ref" element={<OrderDetailPage />} />
      <Route path="*" element={<Navigate to="/orders" replace />} />
    </Routes>
  );
};

export default App;

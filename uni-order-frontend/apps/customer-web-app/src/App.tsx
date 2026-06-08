
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import './index.css'; // File chứa cấu hình Tailwind CSS

function App() {
  return (
      <>
        {/* Bộ thông báo Toast thông minh toàn hệ thống */}
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoutes />
      </>
  );
}

export default App;
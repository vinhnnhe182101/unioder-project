import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Đảm bảo file App.jsx tồn tại cùng thư mục
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
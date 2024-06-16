import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5000,
        open: false,
        cors: true,
	host: '0.0.0.0'
    },
})

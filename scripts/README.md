# Run modes

## Localhost

Open two terminals from the project root:

```powershell
.\scripts\start-backend-local.ps1
.\scripts\start-frontend-local.ps1
```

Open `http://127.0.0.1:5173` in the browser. The backend uses `http://127.0.0.1:8000`.

Before the first run, copy `backend/.env.example` to `backend/.env` and set the PostgreSQL password and database values.

## Deploy on a laptop or local network

On the laptop that runs the backend, copy `backend/.env.deploy.example` to `backend/.env` and set:

- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS=http://FRONTEND_IP:5173`
- `OPERATOR_ALLOWED_NETWORKS` to the allowed network, for example `192.168.1.0/24`

Find the backend laptop IP with:

```powershell
ipconfig
```

Start the backend on that laptop. Pass the client network and the exact frontend origin:

```powershell
.\scripts\start-backend-deploy.ps1 `
	-AllowedNetworks "10.23.21.0/24" `
	-CorsOrigins "http://10.23.21.215:5173"
```

On the laptop that runs the frontend, start it with the backend laptop IP:

```powershell
.\scripts\start-frontend-deploy.ps1 -BackendHost 10.23.21.20
```

Use the frontend laptop IP in `CORS_ALLOWED_ORIGINS` if frontend and backend run on different laptops. Open `http://FRONTEND_IP:5173` from another laptop.

Both laptops must be on the same network, and Windows Firewall must allow TCP ports `8000` and `5173`.

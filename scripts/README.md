# Run modes

## Initial administrator

For a new database, set `INITIAL_ADMIN_USERNAME` and
`INITIAL_ADMIN_PASSWORD` in the local `.env` file. The backend creates that
`super_admin` during its first database initialization, only when no
`super_admin` exists yet. The password is hashed before it is stored.

The Docker deployment uses the PostgreSQL installation on the server, not a
PostgreSQL container. Set `DATABASE_URL` to the server PostgreSQL host. On
backend startup, the application connects to `DB_BOOTSTRAP_ADMIN_DATABASE` and
creates the target database if it does not exist. The PostgreSQL user in
`DATABASE_URL` must have `CREATEDB`. Existing databases and data are preserved.

After the first administrator exists, these variables are ignored by the
bootstrap check. Create additional users from the application's User
Management page. Do not commit the local `.env`; only the `.env.example`
templates belong in Git.

## Localhost

Open two terminals from the project root:

```powershell
.\scripts\start-backend-local.ps1
.\scripts\start-frontend-local.ps1
```

Open `http://127.0.0.1:5173` in the browser. The backend uses `http://127.0.0.1:8000`.

Before the first run, copy `backend/.env.example` to `backend/.env` and set the PostgreSQL password and database values.

For Docker deployment, copy `.env.docker.example` to `.env` instead. Do not
copy `backend/.env.example` as the root Compose environment file. Database
creation occurs during `docker compose up`, not during `docker compose build`.

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

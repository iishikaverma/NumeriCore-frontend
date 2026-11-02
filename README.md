# NumeriCore Frontend

React + TypeScript + Vite UI for the [NumeriCore backend](../NumeriCore-backend).
Enter a measurement set, submit, and see the trapezoidal / midpoint / Simpson
estimates with their errors and the most accurate method highlighted.

## How it talks to the backend

The backend is a stdin→stdout CLI, not an HTTP server. In dev, a small Vite
middleware (`numericoreBridge` in `vite.config.ts`) handles `POST /api/calculate`
by spawning the compiled `numericore` binary, piping the request body to its
stdin, and returning its stdout. No separate server process, no extra deps.

## Prerequisites

Build the backend first so the binary exists:

```bash
cd ../NumeriCore-backend && cmake -S . -B build -G Ninja -DCMAKE_TOOLCHAIN_FILE="$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake" && cmake --build build
```

The bridge looks for `../NumeriCore-backend/build/numericore[.exe]`. Override with
the `NUMERICORE_BIN` environment variable if it lives elsewhere.

## Run

```bash
npm install
```

```bash
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Build

```bash
npm run build
```

> Note: `npm run build` produces a static bundle only. The dev bridge does not
> ship with it — a production deployment needs the backend exposed over HTTP
> (e.g. a small server that spawns the binary, or an HTTP layer added to the
> C++ backend).

# Topic 3 Learning-App Walkthrough (Markdown Edition)

This walkthrough focuses on Topic 3: building a React web app that consumes your Express + Sequelize API.
You already learned CRUD and validation in Topic 1 and Topic 2; now you connect that backend to a frontend UI.
The code examples are based on `Topic 3 - React Web App/learning-app`.
We only use:
- JavaScript (Node.js, Express, Sequelize, React, Vite)
- JSON
- `.env`
- Bash commands

## This Is What Your File Structure Should Look Like

```text
Topic 3 - React Web App/
└─ learning-app/
   ├─ server/
   │  ├─ .env
   │  ├─ index.js
   │  ├─ package.json
   │  ├─ package-lock.json
   │  ├─ README.md
   │  ├─ routes/
   │  │  └─ tutorial.js
   │  └─ models/
   │     ├─ index.js
   │     └─ Tutorial.js
   └─ client/
      ├─ .env
      ├─ package.json
      ├─ package-lock.json
      ├─ vite.config.js
      └─ src/
         ├─ main.jsx
         ├─ App.jsx
         ├─ App.css
         ├─ http.js
         ├─ global.js
         └─ pages/
            └─ Tutorials.jsx

Not Quiz/
└─ Tutorial/
   ├─ topic1_topic2_learning_app_walkthrough.md
   └─ topic3_learning_app_walkthrough.md
```

## Audience, Prerequisites, Learning Goals

Prerequisites:
- Basic JavaScript and ES modules
- Basic React component and hook concepts
- Topic 1 and Topic 2 CRUD API knowledge

Learning goals:
1. Run backend and frontend together for one app flow.
2. Configure CORS and environment variables correctly.
3. Use Axios to call API endpoints from React.
4. Render API data in Material UI components.

## Prerequisite Setup Commands

Open two terminals.

```bash
# Terminal 1 - backend API
cd "Topic 3 - React Web App/learning-app/server"
npm install
npm start
```

```bash
# Terminal 2 - React frontend
cd "Topic 3 - React Web App/learning-app/client"
npm install
npm run dev
```

Verify server runs on `http://localhost:3001` and client runs on `http://localhost:3000`.

**Tip**
- Keep one terminal for server and one for client so logs stay readable.

**Note**
- Topic 3 depends on both processes running at the same time.

---

## Code Cell 1 - Server `package.json` (Backend Dependencies)

This keeps Topic 2 backend foundations: Express, Sequelize, SQLite, Yup, and Nodemon.

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "sequelize": "^6.37.2",
    "sqlite3": "^5.1.7",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

**Tip**
- Confirm backend dependencies before debugging frontend issues.

**Note**
- Topic 3 frontend cannot work if Topic 2 backend setup is broken.

---

## Code Cell 2 - Client `package.json` (React + UI + HTTP)

Topic 3 adds frontend dependencies: React, React Router, MUI, Axios, and Day.js.

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^5.18.0",
    "@mui/material": "^5.18.0",
    "axios": "^1.13.6",
    "dayjs": "^1.11.19",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1"
  }
}
```

**Tip**
- Read dependency names as architecture hints: routing, HTTP, UI, and date formatting.

**Note**
- `axios` handles API calls and `@mui/material` handles layout/components.

---

## Code Cell 3 - `.env` Files (Runtime Configuration)

These values connect frontend and backend correctly.

```env
# server/.env
APP_PORT = 3001
CLIENT_URL = "http://localhost:3000"
DB_FILE = "data/learning.sqlite"
```

```env
# client/.env
VITE_API_BASE_URL=http://localhost:3001
```

**Tip**
- If browser shows CORS errors, check `CLIENT_URL` first.

**Note**
- Vite only exposes frontend env vars that start with `VITE_`.

---

## Code Cell 4 - `server/index.js` (API Bootstrap + DB Sync)

This is your backend entry point: middleware, route mount, and Sequelize sync before listen.

```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);

const db = require('./models');
db.sequelize.sync({ alter: false })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
```

**Tip**
- Always verify DB sync errors before assuming frontend bugs.

**Note**
- Server starts only after `sequelize.sync` resolves.

---

## Code Cell 5 - `server/routes/tutorial.js` (CRUD API Used by React)

This route file provides the endpoints your React page calls (`GET /tutorial`, `POST`, `PUT`, `DELETE`).

```js
const express = require('express');
const yup = require('yup');
const { Tutorial } = require('../models');

const router = express.Router();

const tutorialSchema = yup.object({
  title: yup.string().trim().max(100).required(),
  description: yup.string().trim().required()
});

router.get('/', async (req, res) => {
  const tutorials = await Tutorial.findAll({ order: [['id', 'DESC']] });
  res.json(tutorials);
});

router.get('/:id', async (req, res) => {
  const tutorial = await Tutorial.findByPk(req.params.id);
  if (!tutorial) {
    return res.status(404).json({ message: 'Tutorial not found' });
  }
  return res.json(tutorial);
});

router.post('/', async (req, res) => {
  try {
    const data = await tutorialSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    const tutorial = await Tutorial.create(data);
    return res.status(201).json(tutorial);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    return res.status(500).json({ message: 'Failed to create tutorial' });
  }
});
```

**Tip**
- Start testing with `GET /tutorial` since frontend list page depends on it.

**Note**
- Validation errors return `400`, not `500`.

---

## Code Cell 6 - `client/vite.config.js` (Dev Server Port)

This keeps frontend on port `3000`, which matches backend CORS allowlist.

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

**Tip**
- Keep this aligned with `CLIENT_URL` in backend `.env`.

**Note**
- Port mismatch is one of the most common Topic 3 setup failures.

---

## Code Cell 7 - `client/src/http.js` (Axios Instance)

This centralizes API base URL so every request uses the same origin.

```js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export default instance;
```

**Tip**
- Use one Axios instance instead of hardcoding URLs in many components.

**Note**
- `import.meta.env` is the Vite way to read environment variables.

---

## Code Cell 8 - `client/src/App.jsx` (Routing + App Shell)

This defines top-level navigation and page routes.

```jsx
import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tutorials from './pages/Tutorials';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div">
                Learning
              </Typography>
            </Link>
            <Link to="/tutorials"><Typography>Tutorials</Typography></Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Tutorials />} />
          <Route path={"/tutorials"} element={<Tutorials />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
```

**Tip**
- Keep `/` and `/tutorials` mapped to the same component during early development.

**Note**
- `BrowserRouter` enables URL-based navigation without full page reload.

---

## Code Cell 9 - `client/src/pages/Tutorials.jsx` (Fetch + Render List)

This is the main Topic 3 UI flow: fetch tutorials from API and render cards.

```jsx
import React, { useEffect, useState } from 'react';
import { AccessTime } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';

function Tutorials() {
  const [tutorialList, setTutorialList] = useState([]);

  useEffect(() => {
    http.get('/tutorial').then((res) => {
      setTutorialList(res.data);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Tutorials
      </Typography>
      <Grid container spacing={2}>
        {tutorialList.map((tutorial) => (
          <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {tutorial.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography>
                    {dayjs(tutorial.createdAt).format(global.datetimeFormat)}
                  </Typography>
                </Box>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {tutorial.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Tutorials;
```

**Tip**
- Add API error handling (`catch`) after basic happy-path flow works.

**Note**
- `useEffect(..., [])` runs once on initial page load.

---

## Code Cell 10 - `client/src/global.js` (Shared Formatting Constants)

This keeps presentation constants in one place.

```js
const global = {
  datetimeFormat: 'D MMM YYYY h:mm A'
};

export default global;
```

**Tip**
- Store reusable format strings centrally to keep components clean.

**Note**
- Day.js reads this value when formatting `createdAt`.

---

## Code Cell 11 - Checkpoint 1 (Backend Contract Test with cURL)

Verify API first before debugging React rendering.

```bash
# Create one tutorial
curl -X POST http://localhost:3001/tutorial ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Topic 3 Intro\",\"description\":\"React frontend connected\"}"

# Read tutorial list
curl http://localhost:3001/tutorial
```

Expected result: your created tutorial appears in JSON output.

**Tip**
- If this fails, fix backend before touching frontend.

**Note**
- Topic 3 UI is only a client for these API endpoints.

---

## Code Cell 12 - Checkpoint 2 (Frontend Verification)

Run client and open `http://localhost:3000`.

Expected result:
1. App bar shows `Learning` and `Tutorials`.
2. Tutorials list renders cards.
3. Date appears in `D MMM YYYY h:mm A` format.

**Tip**
- Keep browser DevTools Network tab open to confirm `GET /tutorial` status `200`.

**Note**
- Empty list with `200` usually means DB has no rows yet.

---

## Common Mistakes and Fixes

1. CORS blocked in browser:
Symptom: request fails with CORS error in console.
Fix: ensure backend `.env` has `CLIENT_URL = "http://localhost:3000"` and client runs on port `3000`.

2. Wrong API base URL:
Symptom: Axios request goes to wrong server or fails to connect.
Fix: verify `client/.env` has `VITE_API_BASE_URL=http://localhost:3001`, then restart Vite.

3. Frontend starts but no data shown:
Symptom: page loads but no cards appear.
Fix: test `GET http://localhost:3001/tutorial` directly and create records first.

4. Validation error on create/update:
Symptom: API returns `400` with error list.
Fix: send required `title` and `description`; keep title length <= 100.

5. Changed `.env` but behavior unchanged:
Symptom: old values still used.
Fix: stop and restart both server and client processes after env edits.

---

## Recap and Next Step

What Topic 3 adds on top of Topic 2:
1. React app shell and routing (`App.jsx`).
2. Axios-based API consumption (`http.js`).
3. UI rendering of backend data (`Tutorials.jsx`).
4. Backend + frontend environment coordination (`.env`, CORS, port mapping).

Next step:
1. Add create/edit/delete pages in React and call `POST`, `PUT`, `DELETE`.
2. Add loading and error states for better UX.
3. Add search UI and connect to backend query filtering.

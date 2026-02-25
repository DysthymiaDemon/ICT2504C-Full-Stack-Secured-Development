# Topic 1 -> Topic 2 Learning-App Walkthrough (Markdown Edition)

This is a simple walkthrough of what you learned in Topic 1 and Topic 2.
We start with basic Express API code, then move to Sequelize + SQLite + validation.
The code examples are based on `learning-app`.
We only use:
- JavaScript (Node.js, Express, Sequelize)
- JSON
- `.env`
- Bash commands

## This Is What Your File Structure Should Look Like

```text
Not Quiz/
├─ learning-app/
│  └─ server/
│     ├─ .gitignore
│     ├─ index.js
│     ├─ package.json
│     ├─ package-lock.json
│     ├─ README.md
│     └─ models/
│        ├─ index.js
│        └─ Tutorial.js
└─ Tutorial/
   ├─ topic1_topic2_learning_app_walkthrough.ipynb
   └─ topic1_topic2_learning_app_walkthrough.md
```

## Audience, Prerequisites, Learning Goals

Prerequisites:
- Basic JavaScript syntax
- Basic terminal commands
- Basic idea of JSON format

Learning goals:
1. Build a simple Express API (Topic 1 style).
2. Understand route files and modular routing.
3. Upgrade to SQLite + Sequelize (Topic 2 style).
4. Apply request validation and robust CRUD flow.

## Prerequisite Setup Commands

```bash
cd "Topic 2 - Sequelize ORM and Input Validation/lab2_sqlite_solution/learning-app/server"
npm install
copy .env.example .env
npm start
```

Verify runtime first, install dependencies in each project folder, then start the correct server for Topic 1 or Topic 2.

**Tip**
- Run `npm install` once per server folder before `npm start`.

**Note**
- `nodemon` is used by `npm start`, so the server auto-restarts on file changes.

---

## Code Cell 1 - `package.json` Basics

This mirrors Topic 1 and Topic 2 project setup: dependencies, scripts, and runtime entry points for the API server. This file defines project metadata, start script, and required packages. `scripts.start` is what runs when you type `npm start`.

**Tip**
- Read `scripts.start` first when onboarding a Node project; it tells you how the app is intended to run.
- `scripts.start` is what runs when you type `npm start`.

**Note**
- This file defines project metadata, start script, and required packages.

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

---

## Code Cell 2 - Install and Run Commands

These are the minimum bootstrapping commands used in Topic 1 and Topic 2 labs to install dependencies and start the backend safely. You install dependencies once, then run the API server. `nodemon` restarts automatically when you save code changes.

**Tip**
- Always run commands from the correct `server` directory to avoid installing into the wrong project.
- `nodemon` restarts automatically when you save code changes.

**Note**
- You install dependencies once, then run the API server.

```bash
# Move into the server folder
cd "Topic 2 - Sequelize ORM and Input Validation/lab2_sqlite_solution/learning-app/server"

# Install dependencies from package.json
npm install

# Start the API server using nodemon
npm start
```

---

## Code Cell 3 - Topic 1 `index.js` (API Entry Point)

This is the Topic 1 Express bootstrap flow: load env, register middleware, mount routes, and start listening. This is the server bootstrap: middleware setup, base route, route mount, listen port. It demonstrates the main Express app lifecycle in Topic 1.

**Tip**
- If routes fail, verify the mount path (`/tutorial`) and that the route file exports a router.
- It demonstrates the main Express app lifecycle in Topic 1.

**Note**
- This is the server bootstrap: middleware setup, base route, route mount, listen port.

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Let Express parse incoming JSON request bodies.
app.use(express.json());

// Allow requests from the frontend URL defined in .env.
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);

// Health / welcome route to confirm server is running.
app.get('/', (req, res) => {
    res.send('Welcome to the learning space.');
});

// Mount tutorial routes. Every route inside tutorial.js will be prefixed with /tutorial.
const tutorialRoute = require('./routes/tutorial');
app.use('/tutorial', tutorialRoute);

// Read port from environment and start HTTP server.
let port = process.env.APP_PORT;
app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});
```

---

## Code Cell 4 - Topic 1 `routes/tutorial.js` (In-Memory CRUD Start)

Topic 1 uses in-memory arrays to teach request lifecycle and CRUD behavior before introducing databases. Topic 1 first teaches routing + request/response using simple array storage. It is great for learning flow, but not persistent like a database.

**Tip**
- Treat in-memory storage as training-only; data loss on restart is expected behavior.
- It is great for learning flow, but not persistent like a database.

**Note**
- Topic 1 first teaches routing + request/response using simple array storage.

```js
const express = require('express');

const router = express.Router();
const tutorialList = []; // Temporary in-memory storage (resets on restart)

router.post('/', (req, res) => {
    const data = req.body;   // Read data sent by client
    tutorialList.push(data); // Store into array
    res.json(data);          // Return created item
});

router.get('/', (req, res) => {
    res.json(tutorialList);  // Return current array items
});

module.exports = router;
```

---

## Code Cell 5 - Checkpoint 1 (Quick API Test)

This checkpoint validates your Topic 1 API contract end-to-end by writing and reading tutorial records. First request creates data, second request reads data. Restart server and data disappears, which shows why Topic 2 introduces a real DB.

**Tip**
- Keep one known-good curl example so you can quickly regression-test after route changes.
- Restart server and data disappears, which shows why Topic 2 introduces a real DB.

**Note**
- First request creates data, second request reads data.

```bash
# Create one tutorial
curl -X POST http://localhost:3001/tutorial ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Intro\",\"description\":\"Topic 1 test\"}"

# List tutorials
curl http://localhost:3001/tutorial
```

---

## Code Cell 6 - Topic 2 `.env` (Runtime Configuration)

Topic 2 externalizes runtime config so the same code can run across environments with different ports and DB files. Environment variables let you configure app behavior without hardcoding values. `DB_FILE` decides where SQLite data is stored.

**Tip**
- Never hardcode secrets or environment-specific values directly into source files.
- `DB_FILE` decides where SQLite data is stored.

**Note**
- Environment variables let you configure app behavior without hardcoding values.

```env
APP_PORT = 3001
CLIENT_URL = "http://localhost:3000"
DB_FILE = "data/learning.sqlite"
```

---

## Code Cell 7 - Topic 2 `models/index.js` (Sequelize Init + Model Loading)

This is the Sequelize model bootstrap from Topic 2: initialize DB connection, load models, and expose a single DB object. This file connects Sequelize to SQLite and loads models dynamically. It is the bridge between model files and route files.

**Tip**
- If a model is missing at runtime, check filename case and the exported model factory signature.
- It is the bridge between model files and route files.

**Note**
- This file connects Sequelize to SQLite and loads models dynamically.

```js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();

// Create Sequelize instance for SQLite using DB_FILE from .env.
let sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE
});

// Auto-load every model file in this folder except index.js itself.
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Call associate() if model defines it (useful when there are relationships).
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and loaded models.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

---

## Code Cell 8 - Topic 2 `models/Tutorial.js` (Define Table Schema)

This model defines the Tutorial entity schema and field constraints that Sequelize enforces against SQLite. A model is your DB table blueprint in code. Data types and required rules are defined here.

**Tip**
- Keep model field names aligned with request payload keys to reduce mapping bugs.
- Data types and required rules are defined here.

**Note**
- A model is your DB table blueprint in code.

```js
module.exports = (sequelize, DataTypes) => {
    const Tutorial = sequelize.define("Tutorial", {
        title: {
            type: DataTypes.STRING(100), // VARCHAR-like field with max length 100
            allowNull: false             // Required field
        },
        description: {
            type: DataTypes.TEXT,        // Longer text field
            allowNull: false             // Required field
        }
    }, {
        tableName: 'tutorials'           // Explicit table name in DB
    });
    return Tutorial;
};
```

---

## Code Cell 9 - Topic 2 `index.js` with `sequelize.sync`

This upgrade from Topic 1 to Topic 2 initializes persistent storage by syncing Sequelize models before serving traffic. This is Topic 1 entry point plus DB sync step. Server starts only after DB setup succeeds.

**Tip**
- On startup issues, check DB path and whether `sequelize.sync` errors are logged before app listen.
- Server starts only after DB setup succeeds.

**Note**
- This is Topic 1 entry point plus DB sync step.

```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Allow frontend origin defined in .env.
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Quick test route.
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Mount tutorial routes under /tutorial.
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);

const db = require('./models');

// Sync models to database before starting server.
// If table does not exist, Sequelize creates it.
db.sequelize.sync({ alter: false })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
```

---

## Code Cell 10 - Topic 2 `POST /tutorial` (Validation + Create)

Topic 2 adds input validation and DB-backed create logic so invalid payloads are rejected early and cleanly. Topic 2 adds strict input validation before DB insert. This prevents malformed or missing data from being saved.

**Tip**
- Validate first, then write to DB; this keeps bad records out of persistent storage.
- This prevents malformed or missing data from being saved.

**Note**
- Topic 2 adds strict input validation before DB insert.

```js
const { Tutorial } = require('../models');
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate body first so bad input never reaches DB logic.
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });

    try {
        // abortEarly: false = collect all validation errors, not just first one.
        data = await validationSchema.validate(data, { abortEarly: false });

        // Insert validated data into tutorials table.
        let result = await Tutorial.create(data);
        res.json(result);
    }
    catch (err) {
        // Return 400 for client-side input issues.
        res.status(400).json({ errors: err.errors });
    }
});
```

---

## Code Cell 11 - Topic 2 `GET /tutorial` (Search Query)

This endpoint demonstrates filtered reads with query parameters, a common Topic 2 pattern for scalable list APIs. Query parameters drive dynamic filtering. `Op.like` with `%` is how partial search is done.

**Tip**
- Normalize and sanitize query inputs before building dynamic conditions.
- `Op.like` with `%` is how partial search is done.

**Note**
- Query parameters drive dynamic filtering.

```js
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;

    // If ?search=... exists, search title OR description.
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Tutorial.findAll({
        where: condition,
        order: [['createdAt', 'DESC']] // Newest first
    });

    res.json(list);
});
```

---

## Code Cell 12 - Topic 2 `GET /tutorial/:id` (Find by Primary Key)

This route shows record retrieval by primary key with proper not-found handling for stable API behavior. This teaches URL parameter handling and not-found logic. Returning after 404 prevents accidental extra code execution.

**Tip**
- Return 404 for missing IDs instead of empty success responses; clients can handle that reliably.
- Returning after 404 prevents accidental extra code execution.

**Note**
- This teaches URL parameter handling and not-found logic.

```js
router.get("/:id", async (req, res) => {
    let id = req.params.id;                 // URL parameter value
    let tutorial = await Tutorial.findByPk(id); // Primary key lookup

    // Not found must return 404 and stop handler.
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    res.json(tutorial);
});
```

---

## Code Cell 13 - Topic 2 `PUT /tutorial/:id` (Validate + Update)

This combines Topic 2 validation with update semantics to safely mutate existing rows. Update flow is: check exists -> validate -> update -> return status message. This keeps update behavior predictable and safe.

**Tip**
- Re-check existence before update so clients get deterministic errors for stale IDs.
- This keeps update behavior predictable and safe.

**Note**
- Update flow is: check exists -> validate -> update -> return status message.

```js
router.put("/:id", async (req, res) => {
    let id = req.params.id;

    // Step 1: verify target record exists.
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;

    // Step 2: validate optional update fields.
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Step 3: apply DB update by id.
        let num = await Tutorial.update(data, { where: { id: id } });

        if (num == 1) {
            res.json({ message: "Tutorial was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update tutorial with id ${id}.` });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});
```

---

## Code Cell 14 - Topic 2 `DELETE /tutorial/:id` (Delete by ID)

This completes CRUD by deleting a record and confirms result handling for both success and missing targets. Delete flow mirrors update flow: check exists, attempt operation, return clear result. This is the final CRUD piece taught in Topic 2.

**Tip**
- Log delete outcomes during testing to verify you are deleting the intended record only.
- This is the final CRUD piece taught in Topic 2.

**Note**
- Delete flow mirrors update flow: check exists, attempt operation, return clear result.

```js
router.delete("/:id", async (req, res) => {
    let id = req.params.id;

    // Confirm target exists before delete.
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    // Delete row by id.
    let num = await Tutorial.destroy({
        where: { id: id }
    });

    if (num == 1) {
        res.json({ message: "Tutorial was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete tutorial with id ${id}.` });
    }
});
```

---

## Code Cell 15 - Checkpoint 2 (Practice Task)

This practice block reinforces Topic 2 by requiring full CRUD and validation behavior against persistent data. This reinforces dynamic condition building, a key Topic 2 skill. You practice extending an existing endpoint without breaking current behavior.

**Tip**
- Test both happy path and invalid payload path before considering the checkpoint complete.
- You practice extending an existing endpoint without breaking current behavior.

**Note**
- This reinforces dynamic condition building, a key Topic 2 skill.

```js
// Exercise:
// Add one optional query filter into GET /tutorial.
// Example filter idea: ?titlePrefix=Intro
// If query is provided, include it in condition before findAll().
```

---

## Code Cell 16 - Exercise Scaffold (Guided)

This scaffold is a guided handoff for students to implement remaining logic using Topic 1 routing and Topic 2 model patterns. This is a partial solution so you still do the important thinking. It teaches incremental endpoint enhancement. ## Common Mistakes and Fixes 1. Invalid JSON in request body: Symptom: API returns `400` Terminal may show JSON parse error (for example: expected property name) Why it happens: Single quotes instead of double quotes Missing quote on a key Trailing comma at the end of JSON Fix: In Postman, use `Body -> raw -> JSON` Keep keys and string values in double quotes Example valid body: ```json { "title": "Intro", "description": "Topic 2 test" 2. Missing `return` after 404: Error like `Cannot set headers after they are sent to the client` You send `res.sendStatus(404)` but code continues and tries another `res.json(...)` Always stop the function immediately: ```js if (!tutorial) { res.sendStatus(404); return; 3. Missing `await`: Response data looks wrong or empty Logic runs before DB call finishes Sequelize functions return Promises Use `await` in async handlers: let tutorial = await Tutorial.findByPk(id); Keep `async` in route handler signature. 4. Wrong `.env` values: Server starts on unexpected port CORS errors from frontend DB file not created where expected Wrong key names or wrong relative path Verify keys exactly: `APP_PORT` `CLIENT_URL` `DB_FILE` For Topic 2 SQLite setup, use: ```env APP_PORT = 3001 CLIENT_URL = "http://localhost:3000" DB_FILE = "data/learning.sqlite" Restart server after editing `.env`. ## Recap and Next Step What changed from Topic 1 to Topic 2: 1. In-memory array -> persistent SQLite database. 2. Simple routes -> model-backed routes with Sequelize. 3. No validation -> schema validation with `yup`. 4. Basic API -> stronger CRUD and error handling flow. Next step: Apply the same structure to `movies-app`: ```text movies-app/ └─ server/ ├─ index.js ├─ models/ │  ├─ index.js │  └─ Movie.js ├─ routes/ ├─ .env ├─ package.json └─ package-lock.json

**Tip**
- Implement one endpoint at a time and verify each with curl or Postman before moving forward.
- It teaches incremental endpoint enhancement.

**Note**
- This is a partial solution so you still do the important thinking.

```js
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let titlePrefix = req.query.titlePrefix;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    // TODO:
    // Add another condition when titlePrefix exists.
    // Keep current search logic working together with your new filter.

    let list = await Tutorial.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});
```

---

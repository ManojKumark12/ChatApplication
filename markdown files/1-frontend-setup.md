# React Setup with Vite

## 1. Create React Project

```bash
npm create vite@latest frontend
```

This command creates a **React project using Vite** inside a folder named `frontend`.

During setup select:
- Framework: **React**
- Variant: **JavaScript**

After creation, the project structure looks like:

```
frontend/
 ├── index.html
 ├── package.json
 ├── node_modules/
 ├── src/
 └── vite.config.js
```

---

# 2. What is npm?

**npm (Node Package Manager)** is a tool used to manage JavaScript libraries and project dependencies.

It is used to:

- Install JavaScript libraries
- Manage dependencies
- Run project scripts

Example libraries:

- React
- Express
- Axios
- Vite

Example command:

```bash
npm install react
```

---

# 3. Where Does npm Come From?

`npm` is automatically installed when **Node.js** is installed.

Installing Node.js provides:

- Node runtime
- npm (Node Package Manager)
- npx (Node Package Executor)

Check installation:

```bash
node -v
npm -v
```

---

# 4. What is package.json?

`package.json` is the **main configuration file of a Node project**.

It contains:

- Project name
- Project version
- Dependencies (libraries used)
- Scripts to run the project

Example:

```json
{
  "name": "frontend",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

# 5. Installing Dependencies

After creating the project, install dependencies.

```bash
cd frontend
npm install
```

What happens internally:

1. npm reads the **package.json**
2. Downloads required libraries
3. Stores them in **node_modules**

Project structure:

```
frontend/
 ├── node_modules/
 ├── package.json
 └── src/
```

`node_modules` contains all installed libraries.

---

# 6. Running the React Project

Start the development server:

```bash
npm run dev
```

This starts the **Vite development server**.

The application will run at:

```
http://localhost:5173
```

Open this URL in a browser to see the React app.

---

# Summary

| Concept | Explanation |
|--------|-------------|
| Node.js | JavaScript runtime |
| npm | Node Package Manager |
| Vite | Tool for creating fast React projects |
| package.json | Stores project dependencies |
| node_modules | Folder containing installed libraries |
| npm install | Installs dependencies |
| npm run dev | Starts development server |
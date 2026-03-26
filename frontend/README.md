# Employee Portal — Angular 21 + Spring Boot

A full-stack employee management system.

- **Backend** — Spring Boot 4, Spring Data JPA, MySQL, REST on port `8080`
- **Frontend** — Angular 21, two standalone components, signals throughout

---

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Layout](#2-project-layout)
3. [Backend Setup](#3-backend-setup)
4. [Frontend Setup](#4-frontend-setup)
5. [Angular CLI Commands Reference](#5-angular-cli-commands-reference)
6. [Signal Binding Patterns — Where They Appear](#6-signal-binding-patterns--where-they-appear)
7. [REST API Reference](#7-rest-api-reference)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

Install every tool in the table before continuing.

| Tool | Minimum version | Download |
|------|-----------------|----------|
| Java JDK | 17 | https://adoptium.net |
| MySQL Server | 8.0 | https://dev.mysql.com/downloads/mysql |
| Node.js | 20 LTS | https://nodejs.org |
| npm | 10 | bundled with Node.js |
| Angular CLI | 21 | `npm install -g @angular/cli@21` |

### Check versions in a terminal

```bash
java -version      # 17 or higher
mysql --version    # 8.x
node -v            # v20.x or v22.x
npm -v             # 10.x
ng version         # Angular CLI: 21.x
```

### Install Angular CLI (if not yet installed)

```bash
npm install -g @angular/cli@21
```

---

## 2. Project Layout

```
workspace/
├── backend/                           ← Spring Boot (from the zip)
│   ├── src/main/java/sg/edu/nus/backend/
│   │   ├── api/EmployeeController.java     REST endpoints
│   │   ├── model/Employee.java             JPA entity
│   │   └── repository/EmployeeRepository.java
│   ├── src/main/resources/
│   │   ├── application.properties         DB config
│   │   └── data.sql                       seed data
│   └── pom.xml
│
└── frontend/                          ← Angular 21 (this folder)
    ├── src/
    │   ├── app/
    │   │   ├── models/
    │   │   │   └── employee.model.ts       Employee interface, dropdown lists
    │   │   ├── services/
    │   │   │   └── employee.service.ts     HTTP calls + shared signals
    │   │   ├── components/
    │   │   │   ├── employee-list/
    │   │   │   │   ├── employee-list.component.ts   List + delete logic
    │   │   │   │   └── employee-list.component.html Table + search + confirm dialog
    │   │   │   └── employee-form/
    │   │   │       ├── employee-form.component.ts   Create / edit logic
    │   │   │       └── employee-form.component.html Form with live preview
    │   │   ├── app.component.ts            Root shell + navbar
    │   │   ├── app.config.ts               provideRouter, provideHttpClient
    │   │   └── app.routes.ts               Two lazy routes
    │   ├── styles.css                      Global stylesheet
    │   ├── index.html
    │   └── main.ts
    ├── angular.json
    ├── package.json
    ├── proxy.conf.json                 Forwards /api → localhost:8080
    └── tsconfig.json
```

---

## 3. Backend Setup

### Step 1 — Unzip the backend

```
workspace/
└── backend/   ← result after unzipping
```

### Step 2 — Start MySQL and check credentials

The file `backend/src/main/resources/application.properties` contains:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/backend?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password123
```

Edit the username and password if your MySQL setup is different.

Start MySQL if it is not already running:

```bash
# macOS (Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows — use MySQL Notifier or the Services panel
```

### Step 3 — Run the Spring Boot app

Open a terminal, go into the backend folder, and start the server:

```bash
cd workspace/backend

# macOS / Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

Wait for the line:

```
Started BackendApplication in X.XXX seconds
```

The API is now live at `http://localhost:8080`.

### Step 4 — Verify (optional)

```bash
curl http://localhost:8080/api/employees
```

You should see a JSON array with five employees (Dilbert, Alice, Pointy, Dogbert, Catbert).

---

## 4. Frontend Setup

### Step 1 — Place the frontend folder

```
workspace/
├── backend/
└── frontend/   ← here
```

### Step 2 — Install npm packages

```bash
cd workspace/frontend
npm install
```

This creates the `node_modules/` folder. It takes 1–3 minutes the first time.

### Step 3 — Start the dev server

```bash
ng serve --proxy-config proxy.conf.json
```

Then open **http://localhost:4200** in your browser.

The `--proxy-config` flag tells Angular's dev server to forward every
request starting with `/api` to `http://localhost:8080`. Without it the
browser would try to call `localhost:4200/api/...` which does not exist.

---

## 5. Angular CLI Commands Reference

Run all of these from inside the `frontend/` folder.

---

### `ng new` — Create a new workspace (already done; shown for reference)

```bash
ng new employee-portal --standalone --routing --style=css
```

| Flag | Meaning |
|------|---------|
| `--standalone` | No NgModules; every component is self-contained |
| `--routing` | Creates `app.routes.ts` |
| `--style=css` | Plain CSS stylesheets |

---

### `ng generate component` — Scaffold a component

```bash
ng generate component components/employee-list --standalone
ng generate component components/employee-form --standalone

# Short form
ng g c components/employee-list --standalone
```

This creates two files per component:
- `employee-list.component.ts`
- `employee-list.component.html`

(CSS file is also created; this project puts all styles in `styles.css`.)

---

### `ng generate service` — Scaffold a service

```bash
ng generate service services/employee
# or
ng g s services/employee
```

---

### `ng generate interface` — Scaffold an interface (model)

```bash
ng generate interface models/employee
# or
ng g i models/employee
```

---

### `ng serve` — Start the development server

```bash
ng serve                                      # port 4200, no proxy
ng serve --proxy-config proxy.conf.json       # with API proxy (use this one)
ng serve --port 4201                          # different port
ng serve --open --proxy-config proxy.conf.json  # open browser automatically
```

---

### `ng build` — Build for production

```bash
ng build                          # production build → dist/employee-portal/
ng build --configuration development  # dev build, not minified
```

---

### `ng test` — Run unit tests

```bash
ng test               # watch mode (re-runs on file save)
ng test --no-watch    # run once and exit
```

---

### `ng lint` — Lint TypeScript

```bash
ng lint
```

---

### `ng update` — Update Angular packages

```bash
ng update @angular/core @angular/cli
```

---

## 6. Signal Binding Patterns — Where They Appear

All four patterns are used in this project. Every usage is commented in the source files.

---

### Interpolation — `{{ signal() }}`

A signal is called like a function to read its current value.
Angular re-renders the interpolated text automatically when the signal changes.

| File | Example |
|------|---------|
| `employee-list.component.html` | `{{ filtered().length }} of {{ svc.total() }} employees` |
| `employee-list.component.html` | `{{ emp.name }}`, `{{ emp.salary \| number:'1.2-2' }}` |
| `employee-form.component.html` | `{{ pageTitle() }}` — a computed signal |
| `employee-form.component.html` | `{{ name() }}`, `{{ salary() }}` — model() signals in the live preview |

```html
<!-- employee-list.component.html -->
<p>{{ filtered().length }} of {{ svc.total() }} employees</p>
```

```typescript
// service
readonly total    = computed(() => this.employees().length);
// component
readonly filtered = computed(() => { /* filter logic */ });
```

---

### Property Binding — `[property]="signal()"`

The square brackets tell Angular to evaluate the right-hand side as a
TypeScript expression. The DOM property is updated whenever the signal changes.

| File | Example |
|------|---------|
| `employee-list.component.html` | `[value]="searchTerm()"` on the search input |
| `employee-list.component.html` | `[disabled]="isDeleting()"` on confirm buttons |
| `employee-list.component.html` | `[routerLink]="['/employees', emp.id, 'edit']"` |
| `employee-form.component.html` | `[value]="name()"`, `[value]="salary()"` |
| `employee-form.component.html` | `[selected]="department() === d"` inside `@for` |
| `employee-form.component.html` | `[class.invalid]="!!nameError()"` |
| `employee-form.component.html` | `[disabled]="isPending() \|\| success()"` |

```html
<!-- Disable submit while request is in flight -->
<button [disabled]="isPending() || success()" (click)="submit()">
  {{ btnLabel() }}
</button>
```

---

### Event Binding — `(event)="signal.set(...)"`

Parentheses listen for a DOM event. The handler usually calls `signal.set()`
or a method that calls `signal.set()` internally.

| File | Example |
|------|---------|
| `employee-list.component.html` | `(input)="searchTerm.set(getVal($event))"` |
| `employee-list.component.html` | `(click)="askDelete(emp.id!)"` |
| `employee-list.component.html` | `(click)="doDelete()"`, `(click)="cancelDelete()"` |
| `employee-form.component.html` | `(input)="name.set(str($event))"` |
| `employee-form.component.html` | `(change)="department.set(sel($event))"` |
| `employee-form.component.html` | `(input)="salary.set(num($event))"` |
| `employee-form.component.html` | `(click)="submit()"` |

```html
<!-- Every keystroke writes to the searchTerm signal -->
<input [value]="searchTerm()"
       (input)="searchTerm.set(getVal($event))" />
```

---

### Two-Way Binding — `[(model)]="signal"` via `model()` API

`model()` (Angular 21) creates a **ModelSignal** that can be written by
the parent component through the standard two-way binding syntax.
It replaces the old `@Input() value` + `@Output() valueChange` boilerplate.

In this project, all four form fields in `EmployeeFormComponent` are
declared with `model()`:

```typescript
// employee-form.component.ts
readonly name        = model('');           // ModelSignal<string>
readonly department  = model('');
readonly salary      = model<number | ''>('');
readonly designation = model('');
```

Inside `employee-form.component.html`, the native inputs use the
Event + Property Binding pair (which is exactly what `[(x)]` expands to):

```html
<!--
  This pair IS two-way binding — Angular's [(ngModel)] does the same thing.
  With model(), a parent component could instead write:  [(name)]="someSig"
-->
<input [value]="name()"
       (input)="name.set(str($event))" />
```

Because the form fields live inside the same component that declares
the `model()` signals, we use them directly. If `EmployeeFormComponent`
were used as a child, the parent could write:

```html
<!-- Parent template using two-way binding with the model() API -->
<app-employee-form [(name)]="employeeName" />
```

The `model()` signal then acts as both `@Input()` (the parent sets it)
and `@Output() nameChange` (the child notifies the parent).

---

### Signal-Based Routing — `input()` + `withComponentInputBinding()`

`withComponentInputBinding()` in `app.config.ts` tells the router to
automatically bind route parameters (`:id`) to component `input()` signals.

```typescript
// app.config.ts
provideRouter(routes, withComponentInputBinding())
```

```typescript
// employee-form.component.ts
//  /employees/new      → id() === undefined  → create mode
//  /employees/42/edit  → id() === "42"       → edit mode
readonly id = input<string | undefined>(undefined);

readonly isEditMode = computed(() => !!this.id());

constructor() {
  // effect() re-runs automatically when id() changes
  effect(() => {
    const rawId = this.id();
    if (rawId) this.loadForEdit(Number(rawId));
  });
}
```

```html
<!-- Template reads the route param via interpolation -->
<h1>{{ pageTitle() }}</h1>
<!-- pageTitle() is computed from isEditMode() which reads id() -->
```

---

## 7. REST API Reference

Base URL: `http://localhost:8080`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

### Employee JSON

```json
{
  "id": 1,
  "name": "Dilbert",
  "department": "NUS-ISS",
  "salary": 10000.00,
  "designation": "Engineer"
}
```

### Test with curl

```bash
# List all
curl http://localhost:8080/api/employees

# Create
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Wally","department":"NUS-ISS","salary":9000,"designation":"Engineer"}'

# Update
curl -X PUT http://localhost:8080/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Dilbert Sr","department":"NUS-ISS","salary":12000,"designation":"Senior Engineer"}'

# Delete
curl -X DELETE http://localhost:8080/api/employees/1
```

---

## 8. Troubleshooting

### `ng: command not found`

```bash
npm install -g @angular/cli@21
```

Close and reopen the terminal, then try again.

---

### API calls fail with "Network Error" or 404

Make sure you started the dev server **with the proxy flag**:

```bash
ng serve --proxy-config proxy.conf.json
```

Without it, the browser calls `localhost:4200/api/...` which has no handler.

---

### Spring Boot fails to connect to MySQL

Check that MySQL is running, then verify the credentials in
`backend/src/main/resources/application.properties`.

Start MySQL:

```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

---

### Salary validation error (400 from backend)

The backend rejects salary below 5 500 (`@DecimalMin("5500.00")`).
The Angular form shows a client-side error before the request is even sent.

---

### `node_modules` missing

```bash
cd frontend
npm install
```

---

## Quick Start Checklist

```
[ ] Java 17+ installed
[ ] MySQL running
[ ] backend/src/main/resources/application.properties credentials correct
[ ] cd backend && ./mvnw spring-boot:run
[ ] curl http://localhost:8080/api/employees  →  JSON array
[ ] cd frontend && npm install
[ ] ng serve --proxy-config proxy.conf.json
[ ] Open http://localhost:4200
```

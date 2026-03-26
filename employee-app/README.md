# Employee Management – Angular Frontend

A minimal Angular 17 CRUD frontend for the Spring Boot Employee REST API.

## Prerequisites

- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Spring Boot backend running on `http://localhost:8080`

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens on http://localhost:4200)
ng serve
```

> **CORS**: If the browser blocks requests to localhost:8080, add this to your
> Spring Boot main class or a `@Configuration` bean:
>
> ```java
> @Bean
> public WebMvcConfigurer corsConfigurer() {
>     return new WebMvcConfigurer() {
>         @Override
>         public void addCorsMappings(CorsRegistry registry) {
>             registry.addMapping("/api/**")
>                     .allowedOrigins("http://localhost:4200")
>                     .allowedMethods("GET","POST","PUT","DELETE");
>         }
>     };
> }
> ```

## Project Structure

```
src/
└── app/
    ├── models/
    │   └── employee.model.ts          # Employee TypeScript interface
    ├── services/
    │   └── employee.service.ts        # HTTP service (GET/POST/PUT/DELETE)
    ├── components/
    │   ├── employee-list/
    │   │   ├── employee-list.component.ts   # Table + delete logic
    │   │   └── employee-list.component.html # Table template
    │   └── employee-form/
    │       ├── employee-form.component.ts   # Reactive form, create/edit logic
    │       └── employee-form.component.html # Form template with validation
    ├── app.component.ts               # Root shell, view switching
    ├── app.component.html             # Root template
    └── app.module.ts                  # NgModule declarations & imports
```

## API Endpoints Used

| Action        | Method | URL                        |
|---------------|--------|----------------------------|
| List all      | GET    | /api/employees             |
| Get by ID     | GET    | /api/employees/:id         |
| Create        | POST   | /api/employees             |
| Update        | PUT    | /api/employees/:id         |
| Delete        | DELETE | /api/employees/:id         |

## Validation Rules (mirrors backend)

| Field      | Rule                        |
|------------|-----------------------------|
| name       | Required (@NotNull)         |
| salary     | Minimum 5500.00 (@DecimalMin)|

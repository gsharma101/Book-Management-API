# 📚 Book Management API

A simple RESTful CRUD application built with **Spring Boot** and **PostgreSQL** to manage books.

---

### ✅ **Features**
- Add new books
- View all books
- View book by ID
- Update existing books
- Delete books
- Uses PostgreSQL as the database

---

### 🛠 **Tech Stack**
- Java 21
- Spring Boot 3
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok

---

## 🚀 **Getting Started**

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/book-management-api.git
cd book-management-api
```

---

### 2️⃣ Configure database
Create a PostgreSQL database (for example, `bookdb`).  
Update your `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 3️⃣ Build & run
```bash
mvn clean install
mvn spring-boot:run
```

The API will start at:
```
http://localhost:8080
```

---

## 📦 **API Endpoints**

| Method | Endpoint | Description |
|--|--|--|
| POST | `/api/v1/books` | Add a new book |
| GET | `/api/v1/books` | Get all books |
| GET | `/api/v1/books/{id}` | Get book by ID |
| PUT | `/api/v1/books/{id}` | Update book by ID |
| DELETE | `/api/v1/books/{id}` | Delete book by ID |

---

## 📚 **Example Request (Create a Book)**
```http
POST /api/v1/books
Content-Type: application/json

{
  "title": "Effective Java",
  "author": "Joshua Bloch",
  "price": 650
}
```

---

## ✏ **Future Improvements**
- Global exception handling
- Validation
- Swagger / OpenAPI documentation
- Docker support
- Pagination & sorting
- Frontend with React or Angular

---

## 👤 **Author**
Gaurav Sharma
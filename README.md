# AuraStay - Full Stack Hotel Booking Website

A complete, end-to-end production-style Full Stack Hotel Booking Web Application built with **React (Vite + Tailwind CSS v4)** and **Spring Boot (Spring Security + JWT + JPA + H2)**. 

---

## 🌟 Core Features

### 👤 Customer Features
- **Browse Hotels**: View hotel lists sorted by location.
- **Search Rooms & Live Availability**: Select check-in and check-out dates to query live available rooms dynamically (prevents double bookings).
- **Amenities Filter**: Browse room-specific details and visual amenity tags (WiFi, Spa, Pool, AC, etc.).
- **Promotions & Offers**: Apply discount code coupons (e.g. `WELCOME10`, `SUPERDEAL`, `SUMMER30`) at checkout to calculate savings.
- **Secure Checkout**: Simulated payment gateway form (Credit Card, PayPal, Cash) with request validation.
- **Dispatched Emails**: Automated HTML email confirmation sending on reservation success.
- **Booking History**: Keep track of upcoming stays, verify billing invoice breakdowns, and cancel reservations.

### 🛡️ Admin Features
- **Hotel Management**: Create, view, update, and delete hotels.
- **Room Registry**: Register rooms, assign category classes (Standard, Deluxe, Executive, Penthouse), set night pricing, and toggle maintenance status.
- **Active Promotions**: Establish seasonal code coupons and specify discount percentages and date validity.
- **Reservation Records**: Track stay invoices across all users.

---

## 🛠️ Technology Stack

| Component | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Axios, React Router DOM v7, Lucide Icons | Premium glassmorphism design system, Outfit typography |
| **Backend** | Spring Boot 4.0.6, Spring Security 7.x, Spring Data JPA, Hibernate | RESTful controller API endpoints, Service-Repository architecture |
| **Security** | JSON Web Tokens (JJWT 0.12.5), BCrypt Password Encryption | Role-based authorization (`ROLE_ADMIN` vs `ROLE_CUSTOMER`) |
| **Database** | H2 In-Memory Database, Hibernate Auto Schema Update | Embedded database engine |
| **Documentation** | Springdoc OpenAPI Starter UI 2.5.0 | Interactive Swagger documentation |
| **Utilities** | Java Mail Sender, Lombok annotations, Global Exception Handlers | Structured REST exceptions returning HTTP status codes |

---

## 🗄️ Database Relationships & Entity Schema

The database strictly matches the requested ER design schemas:
- **One User** can have **Many Bookings**
- **One Hotel** can have **Many Rooms**
- **One Room Category** can have **Many Rooms**
- **One Room** can have **Many Amenities** (ManyToMany via `ROOM_AMENITIES` join table)
- **One Booking** belongs to **One User** & **One Room**
- **One Payment** belongs to **One Booking** (OneToOne relationship mapping)

---

## 🚀 Running the Application

### 1. Spring Boot Backend
1. Make sure you have **Java 17+** and **Maven** installed.
2. Navigate to the root directory and run the Maven Spring Boot plugin:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server starts on port `8080`.
4. **H2 Database Console**: Accessible at [http://localhost:8080/h2-console](http://localhost:8080/h2-console).
   - JDBC URL: `jdbc:h2:mem:hoteldb`
   - User Name: `sa`
   - Password: *(leave empty)*
5. **Swagger OpenAPI Documentation**: Browse and test endpoints at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

### 2. React Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Phone |
|---|---|---|---|
| **Admin** | `admin@hotel.com` | `admin123` | `+1-111-222-3333` |
| **Customer** | `customer@hotel.com` | `customer123` | `+1-444-555-6666` |

*Note: You can also use the registration form to create new accounts of either role directly.*

---

## 📋 API Endpoints Table

| Category | Method | URL Path | Role Required |
|---|---|---|---|
| **AUTH** | `POST` | `/auth/register` | Public |
| | `POST` | `/auth/login` | Public |
| **HOTELS** | `GET` | `/hotels` | Public |
| | `GET` | `/hotels/{id}` | Public |
| | `GET` | `/hotels/locations` | Public |
| | `POST` | `/hotels` | `ADMIN` |
| | `PUT` | `/hotels/{id}` | `ADMIN` |
| | `DELETE` | `/hotels/{id}` | `ADMIN` |
| **ROOMS** | `GET` | `/rooms` | Public |
| | `GET` | `/rooms/available` | Public |
| | `POST` | `/rooms` | `ADMIN` |
| | `PUT` | `/rooms/{id}` | `ADMIN` |
| | `DELETE` | `/rooms/{id}` | `ADMIN` |
| **BOOKINGS** | `POST` | `/bookings` | Authenticated |
| | `GET` | `/bookings/user/{id}` | Authenticated |
| | `GET` | `/bookings` | `ADMIN` |
| | `PUT` | `/bookings/{id}/cancel` | Authenticated |
| **PAYMENTS** | `POST` | `/payments` | Authenticated |
| | `GET` | `/payments/booking/{bookingId}` | Authenticated |
| **PROMOTIONS** | `GET` | `/promotions` | Public |
| | `GET` | `/promotions/{code}` | Public |
| | `POST` | `/promotions` | `ADMIN` |

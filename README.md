# WORK HIVE - Reserve the place you need to bee!

WorkHive is a modern web application designed to manage coworking spaces. It allows users to reserve **Workspaces** (individual desks), **Meeting Rooms**, and **Parking Spots** through an intuitive and animated interface.

---

## 🛠️ Technology Stack

- **Database:** PostgreSQL
- **Backend:** Java Spring Boot
- **Frontend:** ReactJS

---

## Key Features

### 🔐 Authentication & Security

- **Secure Login/Register:** JWT-based authentication.
- **Validation:** Strict backend and frontend validation for emails and passwords (regex patterns).
- **Role-based Access:** Distinct interfaces for `User` and `Admin`.

### 👤 User Features

- **Dashboard:**
  - View list of **My Reservations** (Current, Past, Confirmed, Cancelled).
  - **Filtering & Sorting:** Filter by Status or Location; Sort by Date (Ascending/Descending).
  - **Cancellation:** Option to cancel reservations with a "Are you sure?" confirmation popup.
- **Make a Reservation:**
  - **3-Step Process:** 1. Input Criteria -> 2. Choose Space -> 3. Confirm.
  - **Parking Integration:** Option to add a parking spot to the reservation if available.
  - **Smart Navigation:** "Unsaved Changes" warning if the user tries to reload or leave the page mid-reservation.

### 🛡️ Admin Panel

- **Analytics:** View **Top Locations** and list **Inactive Users**.
- **User Management:** View all users and ability to **Ban** users.
- **Reservation Oversight:** View and delete any reservation in the system.
- **Content Management (CRUD):** Add, Edit, or Delete:
  - Locations
  - Spaces (Workspaces / Meeting Rooms)
  - Resources (e.g., Projectors, Monitors)
  - Parking Spots

---

## 🎨 UI/UX Design

The application features a modern, cartoon-inspired design that is simple to follow and highly engaging.

- **Mobile First & Responsive:** Fully optimized for mobile phones and tablets.
- **Thumb-Friendly Navigation:** On mobile devices, the navigation slider is positioned at the bottom of the screen for improved ergonomics.
- **Dynamic Navigation:**
  - **Two-State Slider:** For standard users (Dashboard / Reserve).
  - **Three-State Slider:** Automatically expands for Admins (Dashboard / Reserve / Admin Panel).
- **Animations:**
  - Smooth intro animation when a logged-in user accesses the app.
  - Intuitive focus states (e.g., animated hand pointing to active fields).
  - Transitions between wizard steps.

---

## ⚙️ Setup & Installation Guide

To run this project locally, you need to start three components: The Database, the Backend, and the Frontend.

### 1. Database Setup (PostgreSQL)

You have two options: **Restore from Dump** (Recommended) or **Manual Setup**.

**Option A: Restore from Dump**

1.  Ensure PostgreSQL is installed.
2.  Create an empty database named `work_hive_db`.
3.  Locate the `work_hive_dump.sql` file in the `/database` folder of this repository.
4.  Restore it using pgAdmin or the command line:
    ```bash
    psql -U postgres -d work_hive_db -f database/work_hive_dump.sql
    ```

**Option B: Manual Setup**

1.  Create a database named `work_hive_db`.
2.  Create a dedicated user (replace `secure_password` with your desired password):
    ```sql
    CREATE USER work_hive_admin WITH PASSWORD 'secure_password';
    GRANT ALL PRIVILEGES ON DATABASE work_hive_db TO work_hive_admin;
    GRANT ALL ON SCHEMA public TO work_hive_admin;
    ```

### 2. Backend Setup (Spring Boot)

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Configure the database connection:
    - Go to `src/main/resources/`.
    - Rename `application.properties.template` to `application.properties`.
    - Edit the file and update `spring.datasource.password` with the password you set in Step 1.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
4.  The backend server will start at `http://localhost:8080`.

### 3. Frontend Setup (React)

1.  Open a new terminal and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
4.  The app will open in your browser at `http://localhost:3000`.

---

**Developed by:** Grasu Costin-Alexandru

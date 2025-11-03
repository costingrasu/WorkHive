# WORK HIVE - Aplicație de Rezervări Coworking

Aplicație pentru gestionarea spațiilor de lucru (coworking spaces) printr-un sistem de rezervări pentru birouri, săli de ședință și locuri de parcare.

---

## 🛠️ Arhitectură și Tehnologii

- **Frontend:** ReactJS
- **Backend:** Java Spring Boot
- **Baza de Date:** PostgreSQL

---

## 🚀 Ghid de Setup și Rulare

Pentru a rula acest proiect local, trebuie să porniți 3 componente: Baza de Date, Backend-ul și Frontend-ul.

### 1. Baza de Date (PostgreSQL)

1.  Asigurați-vă că aveți PostgreSQL instalat și pornit.
2.  Creați o bază de date nouă:
    ```sql
    CREATE DATABASE work_hive_db;
    ```
3.  Creați un utilizator dedicat pentru aplicație (înlocuiți `parola_sigura`):
    ```sql
    CREATE USER work_hive_admin WITH PASSWORD 'parola_sigura';
    ```
4.  Acordați utilizatorului toate privilegiile pe baza de date și pe schema `public`:
    ```sql
    GRANT ALL PRIVILEGES ON DATABASE work_hive_db TO work_hive_admin;
    GRANT ALL ON SCHEMA public TO work_hive_admin;
    ```

### 2. Backend (Spring Boot)

1.  Navigați în folderul `backend`: `cd backend`
2.  Copiați fișierul de configurare template:
    - În `src/main/resources/`, redenumiți `application.properties.template` în `application.properties`.
3.  Editați noul `application.properties`:
    - Introduceți parola setată la Pasul 1 (ex: `parola_sigura`) în câmpul `spring.datasource.password`.
4.  Rulați aplicația (folosind IDE-ul, de ex. IntelliJ, sau prin Maven):
    ```bash
    ./mvnw spring-boot:run
    ```
5.  Serverul backend va rula pe `http://localhost:8080`.

### 3. Frontend (React)

1.  Într-un terminal **separat**, navigați în folderul `frontend`: `cd frontend`
2.  Instalați toate dependențele (se face o singură dată):
    ```bash
    npm install
    ```
3.  Porniți serverul de dezvoltare:
    ```bash
    npm start
    ```
4.  Aplicația frontend va rula și se va deschide în browser la `http://localhost:3000`.

---

### Actori și Funcționalități

- **User**: Poate vizualiza, crea și anula propriile rezervări.
- **Admin**: Poate gestiona locații, spații, resurse și toate rezervările.

Sure! Here's your updated `README.md` without emojis, folder structure, tech stack, and author sections:

---

# Chainstore - Authentication and Dashboard Web App

Chainstore is a simple full-stack-like web application (using HTML, CSS, JavaScript, and LocalStorage) that allows users to:

* Sign up / log in securely
* Manage members
* Track payments
* View dashboard stats

All data (users, members, and payments) is stored in **browser LocalStorage**, making this a self-contained client-side application ideal for demo, prototyping, or offline use.

---

## Features

### Authentication

* Sign up with full name, email, and password
* Log in using email and password
* Toggle between sign up and login forms
* "Keep me logged in" option using LocalStorage session

### Homepage (After Login)

* Top navigation bar with Home, About Us, Contact Us
* Sidebar with navigation to:

  * Dashboard (stats)
  * Members
  * Payments
* Welcome message and summary cards showing:

  * Total Members
  * Total Payments
  * Total Amount Received

### Members Management

* Add new members (Name, Email, DOB)
* Members are listed in a table
* Search/filter members by name
* Data saved in LocalStorage

### Payments Management

* Add payments per member
* Specify payment type, mode, amount, and description
* List of payments shown in a table
* Data saved in LocalStorage

---

## How to Run the Application

1. Download or clone the project folder.

2. Open `index.html` in a browser (preferably Chrome).

3. On the authentication page:

   * Sign up with a full name, email, and password.
   * Then log in using the same credentials.

4. After login, you will be redirected to `homepage.html` (or open it manually if not auto-redirected).

5. On the homepage:

   * Use the sidebar to access Dashboard, Members, or Payments.
   * Use the "Add" buttons to add new entries.
   * All data is stored and loaded from browser LocalStorage.

---

## LocalStorage Keys Used

| Key Name              | Description                        |
| --------------------- | ---------------------------------- |
| `users`    | List of all registered users       |
| `currentUser`  | Stores current logged-in user info |
| `members`  | Array of added members             |
| `payments` | Array of added payments            |

---

## Notes

* All data is only stored locally in your browser.
* It will be lost if the user clears their browser data or cache.
* No backend or database is involved in this version.

---

## Future Enhancements

* Add backend and database integration
* Encrypt passwords before saving
* Improve validations and error handling
* Add features like export to CSV, print, pagination, and charts
* Add support for profile pictures and user roles

---

Let me know if you'd like a downloadable `.md` file or if you're pushing this to GitHub and want setup instructions.

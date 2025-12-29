# Smart Issue Board

Smart Issue Board is a simple issue tracking application developed as part of an internship assignment. The application allows users to create, view, and manage issues with authentication, status tracking, and intelligent handling of similar issues.

---

## 1. Why did you choose the frontend stack you used?

I chose **Next.js (React)** as the frontend framework because it provides clean routing using the App Router and enables fast development with a structured project layout. It also integrates seamlessly with **Vercel**, making deployment simple and production-ready.

For UI styling, I used **Bootstrap** because it helps build a responsive and professional interface quickly without over-engineering, allowing me to focus more on business logic.

---

## 2. Explain your Firestore data structure

The application uses **Firebase Firestore** as the backend database. All issues are stored in a collection named `issues`, where each document represents a single issue.

Each issue document contains the following fields:

- `title` – short summary of the issue  
- `description` – detailed explanation  
- `priority` – urgency level (Low, Medium, High)  
- `status` – current state (Open, In Progress, Done)  
- `createdBy` – email of the logged-in user  
- `createdAt` – timestamp of issue creation  

This simple and flat structure ensures easy querying and efficient data retrieval.

---

## 3. Explain how you handled similar issues

When creating a new issue, the application checks existing issues for similarity based on **keyword matching in issue titles**. If a similar title is detected, the user is shown a **confirmation warning** indicating that a similar issue already exists.

The user can then decide whether to continue creating the issue or cancel the action. This approach avoids duplicate issues while remaining user-friendly and flexible, as required by the assignment.

---

## 4. Mention what was confusing or challenging

The most challenging part was implementing the **issue status transition rule**, ensuring that an issue cannot move directly from `Open` to `Done`. This required proper validation logic during status updates to enforce workflow consistency.

Another challenge was integrating Firebase Authentication and Firestore smoothly with the frontend while keeping the code simple and maintainable.

---

## 5. Mention what you would improve next

With more time, I would improve the application by:
- Adding role-based access control
- Implementing issue comments
- Enhancing duplicate issue detection using description similarity
- Improving UI feedback with loading indicators and notifications

---


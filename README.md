# Nextjs Events App | Eventify 

Eventify is a robust full-stack Nextjs app designed for seamless event management. This platform enables users to explore tech-related events with ease. It offers a streamlined experience for browsing events globally, creating and organizing events, purchasing tickets through secure Stripe payment integration. With intuitive search and filtering options, along with features like pagination and related event suggestions.

[View Live Demo](https://nextjs-events-app-bay.vercel.app/)

![eventify-home](https://github.com/user-attachments/assets/49ec30ca-8a60-4d98-95b3-241a52bbb1a2)

## ⚙️Tech Stack
- Next.js
- Node.js
- TypeScript
- MongoDB
- Clerk
- TailwindCSS
- Shadcn UI
- Stripe
- Zod
- React Hook Form
- Uploadthing

## 🚀 Project features 

👉 **Authentication & User Management with Clerk:** Secure user authentication and profile management, including login, registration, and updates, with data synchronization via Webhooks.

👉 **Event Management:** Create, edit, and delete events using a streamlined form with custom components built with React Hook Form and Shadcn UI, with validation by Zod.

👉 **Checkout and Payment with Stripe:** Process ticket payments securely through Stripe APIs and Webhooks.

👉 **Responsive UI:** Accessible, reusable UI components designed for various screen sizes and best practices.

👉 **Event Details & Related Events:** Detailed event pages with relevant information and a section for related events suggested based on categories.

👉 **Dynamic Event Categorization:** Choose from a wide range of existing event categories or add new categories enhancing the scalability of the app.

👉 **Dynamic Search & Category Filter:** Search and filter events by keywords or categories for a refined browsing experience.

👉 **Orders Management:** Track and manage ticket sales with a user-friendly interface for viewing and filtering orders.


## Project Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/) (Yarn Package Manager)

**Cloning the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

**Installation**

Install the project dependencies using yarn:

```bash
yarn install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SERVER_URL=

#CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#MONGODB
MONGODB_URI=

#UPLOADTHING
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

#STRIPE
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
Populate the env varaibles with your own keys from the relevant platforms.

**Run the Development Server**

Start the Next.js development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

**Build for Production**

To build the project for production, run:

```bash
yarn build
```

**Deploy the Project**

For deploying the project, use the following command:

```bash
yarn run deploy
```



# Assignment 4 - Ephemeral Real-Time Chat App

This assignment implements a real-time chat feature for rentals using SignalR, with ephemeral messages that are automatically deleted after 60 seconds.

## Features Implemented

### 1. Real-Time Chat (SignalR)

- **ChatHub**: Created a SignalR Hub (`ChatHub.cs`) to manage real-time communication.
- **Rental Groups**: Users join a specific group for each rental (`Rental-{id}`) to ensure messages are only seen by relevant parties.
- **Live Updates**: Messages are broadcasted instantly to all connected clients in the group.

### 2. Ephemeral Messages (Background Service)

- **Message Storage**: Messages are temporarily stored in the in-memory database (`ChatMessage` entity).
- **Automatic Cleanup**: Implemented a `MessageCleanupService` (BackgroundService) that runs every 10 seconds.
- **Expiry Logic**: Messages older than 60 seconds are automatically deleted from the database to maintain the ephemeral nature of the chat.

### 3. Frontend Integration

- **Chat Interface**: Added a "Chat" button to the Rental List for each active rental.
- **Chat Modal**: Created a `ChatModal` component that connects to the SignalR hub.
- **SignalR Client**: Used `@microsoft/signalr` to handle the connection, joining groups, sending messages, and receiving updates.
- **Real-time UI**: Messages appear instantly, and the UI indicates that messages disappear after 60 seconds.

### 4. Backend Architecture

- **Repository Pattern**: Added `IChatMessageRepository` and `ChatMessageRepository` to handle message data access.
- **Unit of Work**: Integrated the new repository into the existing Unit of Work pattern.
- **Dependency Injection**: Registered all new services (SignalR, BackgroundService, Repositories) in `Program.cs`.

---

# Equipment Rental System (ERS) - React Admin Dashboard

Equipment Rental System is a comprehensive admin dashboard built on **React and Tailwind CSS**, providing everything needed to manage equipment rentals, customers, and rental operations.
dashboard, or admin panel solution for upcoming web projects.

With Equipment Rental System, you get access to all the necessary dashboard UI components, elements, and pages required to manage equipment rentals, customers, and rental operations. Whether you're managing a small rental business or a large equipment fleet, ERS is the perfect solution to help you get up and running quickly.

## Overview

Equipment Rental System provides essential UI components and layouts for managing equipment rentals, customers, and rental operations. It's built on:

- React 19
- TypeScript
- Tailwind CSS

## Project Structure

- **src/components/**: Reusable UI components (buttons, modals, forms, auth forms, common utilities)
- **src/pages/**: Page components for different routes (dashboard, equipment management, customer management, rentals, profile)
- **src/services/**: API service functions for backend communication (auth, equipment, customers, rentals)
- **src/context/**: React context providers for global state management (authentication, theme, sidebar)
- **src/hooks/**: Custom React hooks for shared logic
- **src/layout/**: Layout components (header, sidebar, main app layout)
- **src/icons/**: SVG icon components
- **public/**: Static assets (images, favicon, logos)
- **src/App.tsx**: Main app component with routing
- **src/main.tsx**: Application entry point

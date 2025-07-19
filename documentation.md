
# Assistive Talk - Developer Documentation

## 1. Project Overview

**Assistive Talk** is a responsive, accessible single-page web application (SPA) designed to support non-verbal individuals and those with speech or cognitive disabilities. The app provides a visually intuitive interface to facilitate communication of needs, preferences, and daily activities.

### Core Features:
- **Client Profile Management**: Caregivers can create, search, and delete client profiles.
- **Personalized Schedules**: Each client has their own unique list of activities and meals, which can be scheduled with a date and time.
- **Visual Content Library**: A rich, predefined library of common activities and meals with custom icons makes selection easy for clients.
- **Custom Entries**: Caregivers can add custom activities, meals, and diary entries.
- **Interactive Calendar**: A full-page calendar visualizes a client's schedule.
- **Mood & Diary Tracking**: Features to log a client's mood and keep detailed diary notes.
- **Today's Alerts**: A global alerts menu in the header shows all events scheduled for the current day.
- **Text-to-Speech**: Core accessibility feature to read labels and events aloud.
- **Offline-First**: All data is stored in the browser's `localStorage`, so no internet connection is required after the initial load.

---

## 2. Core Technologies

- **Framework**: React 19 (using `importmap` for dependency management, no build step).
- **Routing**: React Router (`HashRouter`).
- **Styling**: Tailwind CSS (via CDN).
- **Language**: TypeScript.

---

## 3. Application Architecture

### State Management & Data Flow
The application uses a centralized state management pattern.

- **Single Source of Truth**: The `App.tsx` component is the heart of the application. It holds the master `clients` state array, which contains all data for every profile.
- **Top-Down Data Flow**: The `clients` array and any derived data (like `todaysAlerts`) are passed down to child components via props.
- **Bottom-Up Actions**: Actions are initiated by user interactions in child components (e.g., clicking a "Save" button). These components call handler functions (e.g., `onAddClient`) that were passed down as props from `App.tsx`. These handlers update the central `clients` state.
- **Data Persistence**: A `useEffect` hook in `App.tsx` monitors the `clients` state. Whenever the state changes, the hook serializes the entire array and saves it to the browser's `localStorage` under the key `assistive-talk-clients`. On initial load, the application hydrates its state from this `localStorage` key.

---

## 4. Component Breakdown

### Pages (`/pages`)
- **`HomePage.tsx`**: The application's entry point. Displays a grid of `ClientCard` components and a search bar to filter clients.
- **`AddClientPage.tsx`**: A form for creating a new client profile, including name and image upload.
- **`ClientProfilePage.tsx`**: The main dashboard for a single client. It composes the `MoodTracker`, `Diary`, and `OptionSection` components to display all of a client's information.
- **`CalendarPage.tsx`**: Renders the `Calendar` component, providing a monthly view of a client's scheduled activities and meals.

### Components (`/components`)
- **`App.tsx`**: The root component. Manages all state, routing, and data persistence logic.
- **`Header.tsx`**: The global site header. Displays the app title and the alerts dropdown menu.
- **`ClientCard.tsx`**: A simple card that displays a client's image and name, linking to their profile.
- **`OptionSection.tsx`**: A major reusable component for displaying "Activities" and "Meals". It handles the search, the grid of options, and the "add" button which opens the `AddOptionModal`.
- **`OptionButton.tsx`**: A single card representing a scheduled activity or meal. Displays the icon, label, date, and time. Triggers text-to-speech on click.
- **`AddOptionModal.tsx`**: A sophisticated modal for adding new options. It has two tabs:
    - **Library**: Browse and search the predefined list of activities/meals.
    - **Custom**: Add a new item with a custom name.
- **`MoodTracker.tsx`**: A section with emoji buttons to log a client's mood and a list to display recent mood history.
- **`Diary.tsx`**: A section with a textarea to create new diary entries and a list to display past entries chronologically.
- **`Calendar.tsx`**: A reusable component that renders the monthly calendar grid, places events on the correct days, and handles navigation.
- **`ConfirmationModal.tsx`**: A generic modal used to confirm destructive actions, like deleting a client profile.
- **`Icon.tsx`**: A crucial component that renders all SVG icons used throughout the app based on a `name` prop. It contains a large object mapping names to SVG JSX.

### Hooks (`/hooks`)
- **`useTextToSpeech.ts`**: A custom hook that wraps the browser's `SpeechSynthesis` API to provide a simple `speak(text)` function.

---

## 5. How to Make Future Changes

### How to Add a New Default Activity or Meal

This is the most common expected change.

1.  **Create an Icon (Optional but Recommended)**: Find or create a simple, clear SVG icon for the new item. Optimize it using a tool like [SVGOMG](https://jakearchibald.github.io/svgomg/).
2.  **Add the Icon to `Icon.tsx`**:
    - Open `components/Icon.tsx`.
    - In the `icons` object, add a new key-value pair. The key should be a simple name (e.g., `newActivity`), and the value should be the `<svg>...</svg>` JSX.
    ```javascript
    const icons: { [key: string]: React.ReactNode } = {
      // ... existing icons
      newActivity: <svg>...</svg>,
      default: <svg>...</svg>,
    };
    ```
3.  **Add the Option to `constants.ts`**:
    - Open `constants.ts`.
    - Find either the `DEFAULT_ACTIVITIES` or `DEFAULT_MEALS` array.
    - Add a new object to the array with the `label` and the `icon` name you just created.
    ```javascript
    export const DEFAULT_ACTIVITIES: DefaultOption[] = [
      // ... existing activities
      { label: 'New Awesome Activity', icon: 'newActivity' },
    ];
    ```
That's it! The new option will now automatically appear in the "Add Option" modal library.

### How to Add a New Data Field to a Client (e.g., "Allergies")

1.  **Update Type Definition**:
    - In `types.ts`, add the new field to the `Client` interface.
    ```typescript
    export interface Client {
      // ... existing fields
      allergies: string[]; // Or string, depending on your needs
    }
    ```
2.  **Update Client Creation**:
    - In `App.tsx`, find the `handleAddClient` function.
    - Initialize the new field for the `newClient` object.
    ```javascript
    const newClient: Client = {
      // ... existing fields
      diaryEntries: [],
      allergies: [], // Initialize with a default value
    };
    ```
3.  **Update State Logic**:
    - In `App.tsx`, create a new handler function to manage this data (e.g., `handleAddAllergy`). This function will take a `clientId` and the new data, find the right client in the `clients` array, and update their `allergies` field using `setClients`.
4.  **Update UI**:
    - Pass the new handler down to `ClientProfilePage.tsx`.
    - Create a new component (e.g., `AllergyTracker.tsx`) or modify an existing one to display and interact with the new `allergies` data.

### How to Create a New Page

1.  **Create the Page Component**: Create a new file in `/pages`, for example, `pages/ReportsPage.tsx`.
2.  **Add the Route**: In `App.tsx`, add a new `<Route>` inside the `<Routes>` component.
    ```jsx
    <Routes>
      {/* ... existing routes */}
      <Route path="/reports" element={<ReportsPage clients={clients} />} />
    </Routes>
    ```
3.  **Add a Link**: Add a `<Link to="/reports">...</Link>` in a suitable location, like the `Header.tsx` or a client's profile page, to allow users to navigate to your new page.

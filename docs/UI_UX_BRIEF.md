# UI/UX Brief

## 1. Design Vision & Tone
RateHub should feel **trustworthy, clean, and simple**. It is a utility tool meant for fast lookup and rating submissions, so high scannability, clear visual hierarchies, and explicit state indicators (loading/success/error) are paramount.
- **Tone**: Clean, professional, and accessible.
- **Colors**:
  - Primary: Deep Slate/Blue (e.g., `#1e293b` Indigo/Slate) representing trust and structure.
  - Secondary / Call to Action: Amber/Yellow (e.g., `#f59e0b`) representing ratings, stars, and feedback.
  - Success state: Emerald/Green (e.g., `#10b981`).
  - Error state: Rose/Red (e.g., `#f43f5e`).
  - Neutral states: Slate/Cool Grays (`#64748b`, `#f8fafc`).
- **Typography**: San-serif (e.g. Inter or system fonts) with strict weight hierarchies:
  - Titles: bold (`font-bold`), size `text-2xl` or `text-3xl`.
  - Body: regular (`font-normal`), size `text-sm` or `text-base` for high readability.

---

## 2. Page & Layout Architecture

### 2.1 Public Authentication Layout (Unauthenticated)
- **Visuals**: Center-aligned card layout over a soft, light gray background (`bg-slate-50`).
- **Structure**:
  - Central white card with soft shadow (`shadow-md`), rounded corners (`rounded-lg`).
  - Logo or App name banner at the top.
  - Clean input fields with clear labels, placeholders, and support for validation errors below.
  - Action buttons spans full width of card.

### 2.2 System Administrator Layout (Authenticated)
- **Visuals**: Left sidebar layout with a clean horizontal header at the top of the content area.
- **Structure**:
  - **Sidebar**: Sticky left pane containing the RateHub logo and navigation links (Dashboard, Users, Stores, Profile, Logout). Highlights active link. Collapsible on mobile viewports.
  - **Header**: Top pane showing Page Title, user role badge (`ADMIN`), and current logged-in name.
  - **Main Content**: Scrollable pane with a max-width wrapper, spacing standard `p-6`.

### 3.3 Normal User Store Layout (Authenticated)
- **Visuals**: Standard horizontal Navigation Bar layout (Navbar).
- **Structure**:
  - **Navbar**: Clean top menu containing Logo, links to Store Listing, profile dropdown/account menu (Change Password, Logout).
  - **Main Content**: Centralized grid system showing search boxes and store cards.

### 3.4 Store Owner Layout (Authenticated)
- **Visuals**: Left sidebar layout or sticky top navigation menu, emphasizing store statistics.
- **Structure**:
  - Similar to Admin sidebar layout, showing dashboard statistics and user feedback tables.

---

## 3. Reusable UI Component Standards
To prevent duplication and guarantee visual consistency, these components must be built as highly generic, styled components:

### 3.1 Button (`Button.tsx`)
- Props: `variant` (primary, secondary, danger, outline), `size` (sm, md, lg), `isLoading`, `disabled`, `onClick`, `children`.
- Style:
  - Primary: Slate-800 background, text white. Hover states must transition smoothly.
  - Disabled / Loading: Background turns pale gray, pointer events disabled, cursor not-allowed, shows spinning icon.

### 3.2 Input (`Input.tsx`)
- Props: `label`, `error`, `name`, `type`, `placeholder`, `register` (for React Hook Form if used), `required`.
- Style:
  - Input field with standard border (`border-slate-200`), transitioning to a blue border on focus.
  - Displays red border and text below if `error` string is passed.

### 3.3 Modal (`Modal.tsx`)
- Props: `isOpen`, `onClose`, `title`, `children`, `footer`.
- Style:
  - Backdrop filter blur (`backdrop-blur-sm`) with a dark, semi-transparent background.
  - Dialog positioned centrally with scale transitions. Includes an "X" close button at the top-right.

### 3.4 Table (`Table.tsx`)
- Props: `columns`, `data`, `sortState`, `onSort`, `isLoading`.
- Style:
  - Fixed borders, zebra-striping (`even:bg-slate-50`) for read efficiency.
  - Text alignment matches type: Text left-aligned, numbers/ratings centered or right-aligned.
  - Sort indicators (arrows up/down) shown next to sortable columns.

### 3.5 Rating / Star Selector (`StarRating.tsx`)
- Props: `rating` (current rating), `interactive` (boolean), `onChange` (callback if interactive).
- Style:
  - Non-interactive: Renders filled amber stars and empty slate stars (using icons like Lucide Star).
  - Interactive: Hovering over star highlight all preceding stars. Clicking selects the rating value.

### 3.6 Pagination (`Pagination.tsx`)
- Props: `currentPage`, `totalPages`, `onPageChange`, `totalItems`, `pageSize`.
- Style:
  - Previous and Next buttons with active states. Displays numerical pages between. Handles ellipses `...` for large sets.

### 3.7 Loading Skeleton (`LoadingSkeleton.tsx`)
- Style:
  - Uses CSS pulse animation (`animate-pulse`) to show placeholder blocks for text, cards, or tables during data fetches.

### 3.8 Empty State (`EmptyState.tsx`)
- Props: `title`, `description`, `action` (optional button).
- Style:
  - Centered layout inside cards or grids. Uses illustrative icons, muted gray text, and provides clear call-to-actions.

---

## 4. Crucial UX Standards

### 4.1 Input Validation Rules
- Error states must be triggered immediately either on-blur or during form submission.
- Focus is automatically set on the first invalid field.
- Screen readers are notified using standard ARIA properties (`aria-invalid="true"`).

### 4.2 Search Debouncing
- When typing in search inputs, the UI should delay the API call by 300ms to 500ms (debouncing) to avoid spamming database queries on every keypress.
- A search button triggers the action immediately.

### 4.3 Successful Mutations Feedback (Toasts)
- All mutations (signup, store creation, user creation, rating submission, password change) must generate a non-blocking floating Toast notification in the top-right corner.
- Toasts auto-dismiss after 4 seconds.

### 4.4 Mobile Layouts & Responsive Design
- Grids shift from 3 columns (desktop) to 1 column (mobile).
- Tables collapse to scrollable horizontal wrappers (`overflow-x-auto`) or transform into card stacks on mobile devices.
- Sidebar collapses into a hamburger overlay menu on viewports smaller than 768px.

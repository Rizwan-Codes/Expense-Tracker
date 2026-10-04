# SpendWise - Expense Tracker

A simple, single-component expense tracker built with React. Add income and expenses, see where your money goes, and review your history. All data stays in your browser.

## Features

- Add income and expense transactions with a title, amount, and category
- Live balance, total income, and total expense summary
- Expense breakdown by category (pie chart)
- Monthly income vs expense comparison (bar chart)
- Transaction history with category filter and delete
- Data saved automatically in `localStorage`, so it persists across reloads
- Responsive layout for desktop and mobile

## Tech Stack

- [React](https://react.dev/) (hooks: `useState`, `useEffect`)
- [Recharts](https://recharts.org/) for charts
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Getting Started

**Prerequisites:** Node.js 18 or later, and a React project with Tailwind CSS configured.

```bash
# install dependencies
npm install
npm install recharts

# start the dev server
npm run dev
```

Place `App.jsx` in your project's `src/` folder and render it from your entry file.

## Usage

1. Choose **Income** or **Expense**.
2. Enter a title, amount, and category.
3. Click **Add transaction**.
4. Use the category dropdown in **History** to filter, or **Delete** to remove an entry.

## Project Structure

```
src/
└── App.jsx    # UI, state, calculations, and charts in one component
```

## Known Limitations

- Monthly chart groups by month name only, so the same month from different years is merged.
- Amounts are not validated for negative or zero values.
- Data is stored per browser; clearing site data deletes it.

## Possible Improvements

- Group monthly data by year and month
- Edit existing transactions
- Export and import data as CSV
- Split the component into smaller files



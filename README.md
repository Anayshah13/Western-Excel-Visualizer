# 🏭 Western Metals Excel Visualizer

A simple, frontend-only tool for uploading and visualizing Excel-based production data for factories like Western Metals.  
Allows filtering by parameter and date using an intuitive slider.

---

## 📸 Demo

Upload your Excel `.xlsx` file → Select parameters → Filter date range → Instantly visualize the data.

---

## 🚀 Features

- 📤 Upload `.xlsx` Excel files (multi-sheet supported)  
- 📊 Plot 10+ factory parameters using interactive graphs  
- 📅 Smart date range slider initialized to full available range  
- 🪄 Filter parameters dynamically using a tag selector  
- 🧠 Displays average values below each chart  
- ⚡ Instant frontend-only parsing and charting (no backend needed)

---

## 📦 Tech Stack

- **React**
- **Recharts** — for dynamic charts
- **rc-slider** — for range-based date filtering
- **SheetJS (xlsx)** — for reading Excel files
- **Day.js** — for date parsing and formatting

---

## 📂 Example Workflow

1. Upload Excel file (`.xlsx`)
2. Select parameters to display
3. Adjust date range slider
4. View live charts and averages for each parameter

---

Made for internal factory use 🛠️  
No backend. No database. Just plug-and-play charting.

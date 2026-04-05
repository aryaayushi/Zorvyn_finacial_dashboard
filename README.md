# Zorvyn Finance Vault

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faryaayushi%2FZorvyn_finacial_dashboard)

A production-ready, interactive, and beautifully designed full-stack finance dashboard. **Zorvyn Finance Vault** helps you manage transactions, analyze your spending habits deeply, visualize income vs. expenses, and track your net savings using dynamic layouts and advanced components.

## 🚀 Features
- **Smart Overview Dashboard**: High-level snapshot of your balances, total income, expenses, and a custom spend analysis donut chart.
- **Transaction Management**: Comprehensive CRUD tables with filtering, sorting, search, and intuitive entry generation.
- **Deep Insights & Analytics**: Powered by `recharts`. Contains interactive bar charts, area charts, line charts, and pie charts with clean tooltips and dynamic color mapping.
- **Premium Aesthetics**: Fully custom dark/light mode UI, vibrant gradients, custom typography (`Inter`), and a polished glassmorphic aesthetic built with plain CSS.
- **Role-Based Access Control**: Simulate different access levels natively (Admin, Analyst, Viewer).
- **Data Export**: Export your generated transactions directly to a `.csv` file.
- **Context API Management**: Fully local, robust state management using React Context.

## 🛠️ Tech Stack
- **Frontend Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (CSS Variables for dynamic theming)

## 📦 Running the Application Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryaayushi/Zorvyn_finacial_dashboard.git
   cd Zorvyn_finacial_dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View in browser:**
   Open [http://localhost:5173/](http://localhost:5173/) or the port specified in your console.

## 🎨 Interface Highlights
- **Spend Analysis Donut**: A customized, fully interactive donut chart mapping the inner values intuitively.
- **AI-Generated Insights**: The dashboard reads your spendings and injects context-specific tips directly into the UI.
- **Quick Theme Toggle**: Instantly switch between the deep "Dark Vault" and the clean "Light Mode" from the top navigation pane. 

## 🛡️ License
This project is open-source and available under the [MIT License](LICENSE).

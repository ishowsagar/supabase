// App: root component that renders the Header and Dashboard
import Dashboard from "./routes/Dashboard";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}

export default App;

import "./app.css";
import Layout from "./layout/Layout";

function App() {
  console.log(import.meta.env.MODE)
  return (
    <Layout />
  );
}

export default App;
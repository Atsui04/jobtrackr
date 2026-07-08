import { useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("jobs").select("*");
      console.log("data:", data, "error:", error);
    }
    testConnection();
  }, []);

  return (
    <div>
      <p>Hello, World!</p>
    </div>
  );
}

export default App;

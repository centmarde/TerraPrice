import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Hero from "@/pages/hero";
import NotFound from "@/pages/not_found";

function App() {
  // const { role } = useUserAuth();
  return (
    <>
      <Router>
        <Routes>
          {/* outside pages */}
          <Route path="/" element={<Hero />} />
          {/*  end of outside  pages*/}

          {/* inside  pages*/}
          <Route path="/not-found" element={<NotFound />} />
        

          {/* inside */}
          {/* Add more routes as needed */}
          {/* catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

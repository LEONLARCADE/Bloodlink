import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { JourneyProvider } from "../context/JourneyContext";

export function PublicLayout() {
  return (
    <JourneyProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar variant="public" />
        <main className="bl-content flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </JourneyProvider>
  );
}

export default PublicLayout;
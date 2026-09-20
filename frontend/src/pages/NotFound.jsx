import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light">
          <SearchX className="w-7 h-7 text-primary" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">404</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you were looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Button as={Link} to={ROUTES.HOME} leftIcon={Home}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
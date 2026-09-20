import { useEffect } from "react";
import { APP_NAME } from "../constants";

/** Sets document.title as "<title> · BloodLink" and restores on unmount. */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export default useDocumentTitle;
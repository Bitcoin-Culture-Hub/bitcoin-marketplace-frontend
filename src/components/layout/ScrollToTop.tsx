import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls the window to the top on route changes — except when the user
 * triggered the navigation with the browser's back/forward buttons (POP),
 * in which case we let the browser restore the previous scroll position.
 *
 * Mount this once, inside <BrowserRouter> but above <Routes>.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, search, navigationType]);

  return null;
};

export default ScrollToTop;

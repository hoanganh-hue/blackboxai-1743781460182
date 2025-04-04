import { useCallback } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook that extends the wouter's useLocation hook for navigating with additional state.
 * This allows us to pass data between components without needing global state or URL parameters.
 */
export function useNavigationWithState() {
  const [, navigate] = useLocation();

  // Creates a navigation handler that accepts a path and optional state object
  const navigateWithState = useCallback((path: string, state?: any) => {
    // For now, we don't actually do anything with the state since wouter doesn't
    // have native state support like React Router does.
    // In a more complex implementation, we could use a simple state management solution
    // to store this transient state, but for simplicity, we'll just navigate.
    
    navigate(path);
    
    return state; // Return the state for future reference if needed
  }, [navigate]);

  return navigateWithState;
}
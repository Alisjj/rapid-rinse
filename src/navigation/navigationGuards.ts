import { navigationRef } from './navigationRef';

// Navigation guard types
export type NavigationGuard = (
  to: string,
  from?: string
) => boolean | Promise<boolean>;

// Global navigation guards
const globalGuards: NavigationGuard[] = [];

// Add a global navigation guard
export function addNavigationGuard(guard: NavigationGuard) {
  globalGuards.push(guard);
}

// Remove a navigation guard
export function removeNavigationGuard(guard: NavigationGuard) {
  const index = globalGuards.indexOf(guard);
  if (index > -1) {
    globalGuards.splice(index, 1);
  }
}

// Check if navigation is allowed
export async function canNavigate(to: string, from?: string): Promise<boolean> {
  for (const guard of globalGuards) {
    const result = await guard(to, from);
    if (!result) {
      return false;
    }
  }
  return true;
}

// Authentication guard
export const authGuard: NavigationGuard = (to: string) => {
  // This would typically check authentication state
  // For now, we'll assume authentication is handled at the root level
  const authRequiredRoutes = [
    'Main',
    'BookingDetails',
    'BusinessDetails',
    'ServiceBooking',
  ];

  if (authRequiredRoutes.includes(to)) {
    // Check if user is authenticated
    // This should be replaced with actual auth state check
    return true; // Placeholder - will be implemented with auth system
  }

  return true;
};

// Booking guard - prevent navigation away from booking flow without confirmation
export const bookingGuard: NavigationGuard = async (
  to: string,
  from?: string
) => {
  if (from === 'ServiceBooking' && to !== 'BookingConfirmation') {
    // Show confirmation dialog
    // This would typically show a native alert or custom modal
    return new Promise((resolve) => {
      // Placeholder for confirmation dialog
      // In a real implementation, this would show a dialog
      resolve(true);
    });
  }

  return true;
};

// Initialize default guards
export function initializeNavigationGuards() {
  addNavigationGuard(authGuard);
  addNavigationGuard(bookingGuard);
}

// Enhanced navigation function with guards
export async function navigateWithGuards(routeName: string, params?: any) {
  const currentRoute = navigationRef.getCurrentRoute()?.name;

  if (await canNavigate(routeName, currentRoute)) {
    if (navigationRef.isReady()) {
      // @ts-ignore - React Navigation typing issue with dynamic navigation
      navigationRef.navigate(routeName, params);
    }
  } else {
    console.warn(`Navigation to ${routeName} was blocked by guards`);
  }
}

// Navigation exports
export { RootNavigator } from './RootNavigator';
export { AuthStack } from './AuthStack';
export { MainTabs } from './MainTabs';
export { HomeStack } from './HomeStack';
export { BookingStack } from './BookingStack';
export { ProfileStack } from './ProfileStack';
export { SearchStack } from './SearchStack';

// Navigation hooks
export { useTypedNavigation, useTypedRoute } from './hooks';

// Navigation utilities
export { navigationRef, navigate, goBack, reset } from './navigationRef';
export {
  saveNavigationState,
  loadNavigationState,
  clearNavigationState,
} from './navigationPersistence';
export {
  addNavigationGuard,
  removeNavigationGuard,
  navigateWithGuards,
  initializeNavigationGuards,
} from './navigationGuards';
export * from './animations';

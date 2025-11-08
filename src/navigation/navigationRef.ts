import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import type { RootStackParamList } from '../types';

// Create a navigation reference for imperative navigation
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Navigation utilities for imperative navigation
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore - React Navigation typing issue with dynamic navigation
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(routeName: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName as never }],
    });
  }
}

export function push(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore - React Navigation typing issue with dynamic navigation
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function replace(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore - React Navigation typing issue with dynamic navigation
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationState } from '@react-navigation/native';

const NAVIGATION_STATE_KEY = '@navigation_state';

export async function saveNavigationState(state: NavigationState | undefined) {
  try {
    if (state) {
      await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.warn('Failed to save navigation state:', error);
  }
}

export async function loadNavigationState(): Promise<
  NavigationState | undefined
> {
  try {
    const stateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
    return stateString ? JSON.parse(stateString) : undefined;
  } catch (error) {
    console.warn('Failed to load navigation state:', error);
    return undefined;
  }
}

export async function clearNavigationState() {
  try {
    await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation state:', error);
  }
}

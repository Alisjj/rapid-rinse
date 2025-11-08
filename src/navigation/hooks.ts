import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  BookingStackParamList,
  ProfileStackParamList,
  SearchStackParamList,
} from '../types';

// Root navigation hook
export function useTypedNavigation<
  T extends Record<string, object | undefined> = RootStackParamList,
>() {
  return useNavigation<NativeStackNavigationProp<T>>();
}

// Typed route hook
export function useTypedRoute<T extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, T>>();
}

// Stack-specific navigation hooks
export function useAuthNavigation() {
  return useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
}

export function useMainTabNavigation() {
  return useNavigation<BottomTabNavigationProp<MainTabParamList>>();
}

export function useHomeNavigation() {
  return useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
}

export function useBookingNavigation() {
  return useNavigation<NativeStackNavigationProp<BookingStackParamList>>();
}

export function useProfileNavigation() {
  return useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
}

export function useSearchNavigation() {
  return useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
}

// Route-specific hooks
export function useAuthRoute<T extends keyof AuthStackParamList>() {
  return useRoute<RouteProp<AuthStackParamList, T>>();
}

export function useMainTabRoute<T extends keyof MainTabParamList>() {
  return useRoute<RouteProp<MainTabParamList, T>>();
}

export function useHomeRoute<T extends keyof HomeStackParamList>() {
  return useRoute<RouteProp<HomeStackParamList, T>>();
}

export function useBookingRoute<T extends keyof BookingStackParamList>() {
  return useRoute<RouteProp<BookingStackParamList, T>>();
}

export function useProfileRoute<T extends keyof ProfileStackParamList>() {
  return useRoute<RouteProp<ProfileStackParamList, T>>();
}

export function useSearchRoute<T extends keyof SearchStackParamList>() {
  return useRoute<RouteProp<SearchStackParamList, T>>();
}

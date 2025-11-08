import { useState, useCallback, useEffect, useMemo } from 'react';
import { BusinessService } from '../services/firebase/businessService';
import { Service } from '../types';

interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

interface UseServicesReturn {
  // State
  services: Service[];
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;

  // Filtered data
  filteredServices: Service[];
  selectedCategory: string | null;

  // Actions
  loadServices: (businessId?: string) => Promise<void>;
  filterByCategory: (categoryId: string | null) => void;
  searchServices: (searchTerm: string) => void;
  getServiceById: (serviceId: string) => Service | null;
  getServicesByCategory: (categoryId: string) => Service[];

  // Utilities
  clearError: () => void;
  clearFilters: () => void;
}

/**
 * Service management hook with category-based filtering
 * Provides service data operations with search and filtering capabilities
 */
export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear filters function
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchTerm('');
  }, []);

  // Load services from a specific business or all services
  const loadServices = useCallback(async (businessId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let allServices: Service[] = [];

      if (businessId) {
        // Load services from specific business
        allServices = await BusinessService.getBusinessServices(businessId);
      } else {
        // Load services from all businesses (this would need to be implemented in BusinessService)
        // For now, we'll load from a sample business or implement a getAllServices method
        throw new Error('Loading all services not implemented yet');
      }

      setServices(allServices);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load services';
      setError(errorMessage);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter services by category
  const filterByCategory = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  // Search services
  const searchServices = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  // Get service by ID
  const getServiceById = useCallback(
    (serviceId: string): Service | null => {
      return services.find((service) => service.id === serviceId) || null;
    },
    [services]
  );

  // Get services by category
  const getServicesByCategory = useCallback(
    (categoryId: string): Service[] => {
      return services.filter((service) => service.category === categoryId);
    },
    [services]
  );

  // Memoized categories
  const categories = useMemo((): ServiceCategory[] => {
    const categoryMap = new Map<string, Service[]>();

    services.forEach((service) => {
      const category = service.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(service);
    });

    return Array.from(categoryMap.entries())
      .map(([categoryId, categoryServices]) => ({
        id: categoryId,
        name:
          categoryId.charAt(0).toUpperCase() +
          categoryId.slice(1).replace(/[-_]/g, ' '),
        services: categoryServices.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  // Memoized filtered services
  const filteredServices = useMemo((): Service[] => {
    let filtered = services;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [services, selectedCategory, searchTerm]);

  return {
    // State
    services,
    categories,
    loading,
    error,

    // Filtered data
    filteredServices,
    selectedCategory,

    // Actions
    loadServices,
    filterByCategory,
    searchServices,
    getServiceById,
    getServicesByCategory,

    // Utilities
    clearError,
    clearFilters,
  };
};

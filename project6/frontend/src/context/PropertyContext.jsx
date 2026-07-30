import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../api/axios';
import { initialProperties } from '../data/seedProperties';

const PropertyContext = createContext();

const STORAGE_KEY = 'havenkey_properties_v3';

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => {
    // Clear legacy keys if present
    localStorage.removeItem('havenkey_properties');
    localStorage.removeItem('havenkey_properties_v2');

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if cached data still contains old US cities
        const hasUSData = parsed.some(
          (p) =>
            p.location?.city === 'Malibu' ||
            p.location?.city === 'Los Angeles' ||
            p.location?.state === 'CA'
        );
        if (!hasUSData && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored properties', e);
      }
    }
    return initialProperties;
  });

  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('havenkey_leads');
    return savedLeads
      ? JSON.parse(savedLeads)
      : [
          {
            _id: 'lead-1',
            propertyTitle: 'The Glass Horizon Sea-Facing Villa',
            name: 'Jessica Taylor',
            email: 'jessica@example.com',
            phone: '+91 98200 34567',
            message: 'I would like to schedule a viewing for this luxury villa.',
            tourType: 'in_person',
            tourDate: '2026-08-05',
            tourTime: '14:00',
            status: 'new',
            createdAt: new Date().toISOString()
          }
        ];
  });

  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    city: 'All',
    listingType: 'all', // 'buy', 'rent', 'all'
    propertyType: 'all', // 'villa', 'apartment', 'penthouse', 'house', 'condo', 'townhouse', 'all'
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: 'any',
    amenities: [],
    sort: 'latest', // 'latest', 'price_asc', 'price_desc', 'sqft_desc'
    search: ''
  });

  // Sync properties to localStorage for offline fallback capability
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('havenkey_leads', JSON.stringify(leads));
  }, [leads]);

  // Fetch properties from Express backend API
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city && filters.city !== 'All') queryParams.append('city', filters.city);
      if (filters.listingType && filters.listingType !== 'all') queryParams.append('listingType', filters.listingType);
      if (filters.propertyType && filters.propertyType !== 'all') queryParams.append('propertyType', filters.propertyType);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms && filters.bedrooms !== 'any') queryParams.append('bedrooms', filters.bedrooms);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.amenities.length > 0) queryParams.append('amenities', filters.amenities.join(','));

      const res = await api.get(`/properties?${queryParams.toString()}`);
      if (res.data.success && res.data.data.length > 0) {
        setProperties(res.data.data);
        setApiConnected(true);
      }
    } catch (error) {
      console.warn('Express backend API offline or connecting... Using local dataset.', error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  // Client-side filtering logic for seamless real-time response
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const titleMatch = prop.title?.toLowerCase().includes(q);
        const descMatch = prop.description?.toLowerCase().includes(q);
        const cityMatch = prop.location?.city?.toLowerCase().includes(q);
        const addrMatch = prop.location?.address?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !cityMatch && !addrMatch) return false;
      }

      // City filter
      if (filters.city !== 'All') {
        if (prop.location?.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
      }

      // Listing type (buy / rent)
      if (filters.listingType !== 'all') {
        if (prop.listingType !== filters.listingType) return false;
      }

      // Property type
      if (filters.propertyType !== 'all') {
        if (prop.propertyType !== filters.propertyType) return false;
      }

      // Bedrooms
      if (filters.bedrooms !== 'any') {
        if (prop.specs?.bedrooms < Number(filters.bedrooms)) return false;
      }

      // Bathrooms
      if (filters.bathrooms !== 'any') {
        if (prop.specs?.bathrooms < Number(filters.bathrooms)) return false;
      }

      // Min Price
      if (filters.minPrice && prop.price < Number(filters.minPrice)) return false;

      // Max Price
      if (filters.maxPrice && prop.price > Number(filters.maxPrice)) return false;

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((am) => prop.amenities?.includes(am));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price;
      if (filters.sort === 'price_desc') return b.price - a.price;
      if (filters.sort === 'sqft_desc') return (b.specs?.sqft || 0) - (a.specs?.sqft || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [properties, filters]);

  // Actions
  const addProperty = async (newPropData) => {
    try {
      const res = await api.post('/properties', newPropData);
      if (res.data?.success) {
        setProperties((prev) => [res.data.data, ...prev]);
        return { success: true };
      }
    } catch (e) {
      console.warn('API error adding property, using local update', e);
    }
    const localNew = {
      ...newPropData,
      _id: `prop-custom-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProperties((prev) => [localNew, ...prev]);
    return { success: true };
  };

  const updateProperty = async (id, updatedData) => {
    try {
      await api.put(`/properties/${id}`, updatedData);
    } catch (e) {
      console.warn('API error updating property, using local update', e);
    }
    setProperties((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p))
    );
    return { success: true };
  };

  const deleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
    } catch (e) {
      console.warn('API error deleting property, using local update', e);
    }
    setProperties((prev) => prev.filter((p) => p._id !== id));
    return { success: true };
  };

  const submitInquiry = async (leadData) => {
    try {
      const res = await api.post('/leads', leadData);
      if (res.data?.success) {
        setLeads((prev) => [res.data.data, ...prev]);
        return { success: true, message: res.data.message };
      }
    } catch (e) {
      console.warn('API error submitting inquiry, updating local state', e);
    }
    const newLead = {
      ...leadData,
      _id: `lead-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setLeads((prev) => [newLead, ...prev]);
    return { success: true, message: 'Inquiry submitted successfully!' };
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await api.patch(`/leads/${id}/status`, { status });
    } catch (e) {
      console.warn('API update lead status error', e);
    }
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  const deleteLead = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
    } catch (e) {
      console.warn('API delete lead error', e);
    }
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  const resetFilters = () => {
    setFilters({
      city: 'All',
      listingType: 'all',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
      bathrooms: 'any',
      amenities: [],
      sort: 'latest',
      search: ''
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        leads,
        loading,
        apiConnected,
        filters,
        setFilters,
        resetFilters,
        addProperty,
        updateProperty,
        deleteProperty,
        submitInquiry,
        updateLeadStatus,
        deleteLead,
        fetchProperties
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => useContext(PropertyContext);

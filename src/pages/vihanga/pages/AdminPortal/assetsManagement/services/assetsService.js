import axios from 'axios';
import { appURL } from 'utilities/baseurl';
import { Toast } from 'service/toast';

// Get company ID from localStorage
const getCompanyId = () => {
  return localStorage.getItem("companyId") !== null 
    ? JSON.parse(localStorage.getItem("companyId")) 
    : null;
};

// Assets Management API Service
export const assetsService = {
  // Create new asset
  createAsset: async (assetData) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.post(`${appURL}/add-asset`, {
        ...assetData,
        companyId
      }, {
        params: { companyId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Create asset error:', error);
      throw error;
    }
  },

  // Get all assets
  getAssets: async (params = {}) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.get(`${appURL}/allAssets`, {
        params: {
          companyId,
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get assets error:', error);
      throw error;
    }
  },

  // Get single asset
  getSingleAsset: async (assetId) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.get(`${appURL}/singleAsset/${assetId}`, {
        params: { companyId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get single asset error:', error);
      throw error;
    }
  },

  // Update asset
  updateAsset: async (assetId, assetData) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.put(`${appURL}/updateAsset/${assetId}`, assetData, {
        params: { companyId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Update asset error:', error);
      throw error;
    }
  },

  // Delete asset
  deleteAsset: async (assetId) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.delete(`${appURL}/delete/${assetId}`, {
        params: { companyId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Delete asset error:', error);
      throw error;
    }
  },

  // Get assets by employee
  getAssetsByEmployee: async (employeeId) => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const response = await axios.get(`${appURL}/assets/employee/${employeeId}`, {
        params: { companyId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get assets by employee error:', error);
      throw error;
    }
  }
};

// Utility functions
export const formatAssetData = (assets) => {
  return assets.flatMap(({
    _id,
    fullName,
    employeeId,
    position,
    workLocation,
    department,
    assets = []
  }) =>
    assets.map(({
      _id: assetId,
      assetType,
      assetNumber,
      issueDate,
      // collectionDate
    }) => ({
      _id,
      assetId,
      fullName,
      employeeId,
      position,
      workLocation,
      department,
      assetType,
      assetNumber,
      issueDate,
      // collectionDate,
      // For table display - comma separated values when employee has multiple assets
      assetTypes: assets.map(asset => asset.assetType).join(', '),
      assetNumbers: assets.map(asset => asset.assetNumber).join(', ')
    }))
  );
};

export const showToast = (message, type = 'success') => {
  Toast({ message, type });
}; 
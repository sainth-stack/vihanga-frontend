import { useState, useCallback, useEffect } from 'react';
import { assetsService, showToast } from '../services/assetsService';
import { storeEmployeeId } from '../../../../../../utilities/getLocalStorageItem';
import axios from 'axios';
import { appURL } from 'utilities/baseurl';

export const useAssetsManagement = () => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
     const raw = localStorage.getItem("companyId");
const companyId = raw ? JSON.parse(raw) : null;

        const response = await axios.get(`${appURL}/employees/getEmployees/${companyId}`);
        const employees = response?.data?.data || [];
        console.log("employees",employees)
        const options = employees.map(emp => ({
          value: emp._id,
          label: `${emp.personalInformation?.firstName} ${emp.personalInformation?.lastName}`.trim(),
          department: emp?.employmentInformation?.department || "",
          position: emp?.employmentInformation?.designation || "",
          employeeId: emp?.employmentInformation?.employeeNumber || "",
        }));
        setEmployeeOptions(options);
      } catch (error) {
       console.log("error",error)
      }
    };
    fetchEmployees();
  }, []);
  
  const handleEmployeeSelect = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployeeId: selectedOption.value,
      fullName: selectedOption.label,
      employeeId: selectedOption.employeeId,
      department: selectedOption.department,
      position: selectedOption.position,
    }));
  };

  const [formData, setFormData] = useState({
    selectedEmployeeId: '',
    fullName: '', 
    employeeId: '', 
    department: '', 
    position: '', 
    workLocation: ''
  });

  const [assetForms, setAssetForms] = useState([
    { assetType: '', assetNumber: '', issueDate: '', /* collectionDate: '' */ handoverDate:''}
  ]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);

  const handleChange = (index, e) => {
    const { id, value } = e.target;
    const updatedAssets = [...assetForms];
    updatedAssets[index] = { ...updatedAssets[index], [id]: value };
    setAssetForms(updatedAssets);
  };

  const handleAssetTypeChange = (index, event) => {
    const { value } = event.target;
    const updatedAssets = [...assetForms];
    updatedAssets[index] = {
      ...updatedAssets[index],
      assetType: value || '',
    };
    setAssetForms(updatedAssets);
  };

  const handleAddAsset = () => {
    setAssetForms([
      ...assetForms,
      { assetType: '', assetNumber: '', issueDate: '', /* collectionDate: '' */ handoverDate:'' }
    ]);
  };

  const handleRemoveAsset = (index) => {
    setAssetForms(assetForms.filter((_, i) => i !== index));
  };

  const handleEdit = useCallback((selectedRow) => {
    console.log("selectedRow", selectedRow);
    console.log("employeeOptions", employeeOptions);
    
    setIsEditMode(true);
    setEditingAssetId(selectedRow._id);
    
    
    const matchingEmployee = employeeOptions.find(opt => String(opt.employeeId) === String(selectedRow.employeeId));
    console.log("matchingEmployee", matchingEmployee);
    const selectedEmployeeIdValue = matchingEmployee?.value || '';
    console.log("selectedEmployeeIdValue", selectedEmployeeIdValue);
    
    setFormData({
      _id: selectedRow._id,
      selectedEmployeeId: selectedEmployeeIdValue,
      employeeId: selectedRow.employeeId || '',
      fullName: selectedRow.fullName || '',
      department: selectedRow.department || '',
      position: selectedRow.position || '',
      workLocation: selectedRow.workLocation || ''
    });

    // If there are multiple assets, show them all for editing
    if (selectedRow.assets && selectedRow.assets.length > 0) {
      const assetsForEdit = selectedRow.assets.map(asset => ({
        _id: asset._id || '',
        assetType: asset.assetType || '',
        assetNumber: asset.assetNumber || '',
        issueDate: asset.issueDate ? asset.issueDate.slice(0, 10) : '',
        // collectionDate: asset.collectionDate ? asset.collectionDate.slice(0, 10) : '',
        handoverDate: asset.handoverDate ? asset.handoverDate.slice(0, 10) : ''

      }));
      setAssetForms(assetsForEdit);
    } else {
      // Fallback to single asset display
      setAssetForms([{
        _id: selectedRow.assetId || '',
        assetType: selectedRow.assetType || '',
        assetNumber: selectedRow.assetNumber || '',
        issueDate: selectedRow.issueDate ? selectedRow.issueDate.slice(0, 10) : '',
        // collectionDate: selectedRow.collectionDate ? selectedRow.collectionDate.slice(0, 10) : '',
        handoverDate: selectedRow.handoverDate ? selectedRow.handoverDate.slice(0, 10) : ''

        
      }]);
    }

    if (selectedRow.employeeId) {
      setSelectedEmployeeId(selectedRow.employeeId);
      storeEmployeeId(selectedRow.employeeId);
    }
  }, [employeeOptions]);

  const handleReset = () => {
    setFormData({
      fullName: '',
       employeeId:'',
      department: '',
      position: '',
      workLocation: ''
    });
    setAssetForms([{ assetType: '', assetNumber: '', issueDate: '', /* collectionDate: '' */ handoverDate:''}]);
    setSelectedEmployeeId('');
    setFormErrors({});
    setIsEditMode(false);
    setEditingAssetId(null);
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic validation - only check for truly essential fields
    // Let backend handle most validation
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';

    // Validate assets - only check essential fields
    assetForms.forEach((asset, index) => {
      if (!asset.assetType.trim()) errors[`assetType_${index}`] = 'Asset type is required';
      if (!asset.assetNumber.trim()) errors[`assetNumber_${index}`] = 'Asset number is required';
      // Remove validation for issue date and collection date - let backend handle
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill in the required fields', 'error');
      return;
    }

    const payload = {
      ...formData,
      employeeId: selectedEmployeeId || formData.employeeId,
      assets: assetForms.map(asset => ({
        ...asset,
        issueDate: asset.issueDate ? new Date(asset.issueDate).toISOString() : null,
        // collectionDate: asset.collectionDate ? new Date(asset.collectionDate).toISOString() : null,
        handoverDate: asset.handoverDate ? new Date(asset.handoverDate).toISOString() : null,

      }))
    };

    console.log("Submitting Payload:", payload);

    setIsSubmitting(true);
    try {
      let response;
      
      if (isEditMode && editingAssetId) {
        response = await assetsService.updateAsset(editingAssetId, payload);
        showToast(response?.message || 'Asset updated successfully', 'success');
      } else {
        response = await assetsService.createAsset(payload);
        showToast(response?.message || 'Asset created successfully', 'success');
      }

      handleReset();
      setRefreshTable(prev => !prev);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    formData,
    setFormData,
    assetForms,
    selectedEmployeeId,
    error,
    isSubmitting,
    refreshTable,
    formErrors,
    isEditMode,
    editingAssetId,
    
    // Actions
    handleChange,
    handleAssetTypeChange,
    handleAddAsset,
    handleRemoveAsset,
    handleEdit,
    handleReset,
    handleSubmit,
    validateForm,
    // Employee dropdown
    employeeOptions,
    handleEmployeeSelect
  };
}; 
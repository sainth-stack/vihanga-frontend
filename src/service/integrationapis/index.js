import { api, getServiceUrl } from 'service/api';
import { salesforceApi, jiraApi } from '../apiVariables';
import axios from 'axios';
// GET requests
export const getSalesforceUser = async () => {
  try {
    const token = localStorage.getItem('sf_access_token');
    const response = await axios.get(`${getServiceUrl('production')}${salesforceApi.getSalesforceUserInfo.api}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKPIs = async (status) => {
  try {
    const response = await axios.get(`${getServiceUrl('production')}${salesforceApi.getKPIs.api}/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKPIById = async (id) => {
  try {
    const response = await api({ ...salesforceApi.getKPIById(id) });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST requests
export const querySalesforce = async (payload) => {
  const token = localStorage.getItem('sf_access_token');
  const response = await axios.post(`${getServiceUrl('production')}${salesforceApi.getResponseFromQuery.api}`, payload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const createKPI = async (payload) => {
  const response = await api({ ...salesforceApi.createKPI, body: payload });
  return response.data;
};

// PUT requests
export const updateKPI = async (id, payload) => {
  const response = await api({ ...salesforceApi.updateKPI(id), body: payload });
  return response.data;
};

// DELETE requests
export const deleteKPI = async (id) => {
  const response = await api({ ...salesforceApi.deleteKPI(id) });
  return response.data;
};

// Jira APIs
export const getJiraIssues = async (params) => {
  const response = await api({
    ...jiraApi.getIssues,
    method: 'get',
    params,
  });
  return response.data;
};

export const getJiraTasks = async (params) => {
  const response = await api({
    ...jiraApi.getTasks,
    method: 'get',
    params,
  });
  return response.data;
};

export const syncJiraStatuses = async (payload) => {
  const response = await api({
    ...jiraApi.syncJiraStatuses,
    body: payload,
  });
  return response.data;
};

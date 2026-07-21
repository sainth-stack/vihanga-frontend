export const ASSET_TYPES = [
  { label: "Laptop", value: "laptop" },
  { label: "Mobile Phone", value: "mobile" },
  { label: "Monitor", value: "monitor" },
  { label: "Desktop", value: "desktop" },
  { label: "Tablet", value: "tablet" },
  { label: "Headphones", value: "headphones" },
  { label: "Mouse", value: "mouse" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Printer", value: "printer" },
  { label: "Scanner", value: "scanner" },
  { label: "Webcam", value: "webcam" },
  { label: "Docking Station", value: "docking_station" },
  { label: "External Hard Drive", value: "external_hdd" },
  { label: "USB Drive", value: "usb_drive" },
  { label: "Network Equipment", value: "network_equipment" },
  { label: "Software License", value: "software_license" },
  { label: "Office Chair", value: "office_chair" },
  { label: "Desk", value: "desk" },
  { label: "Other", value: "other" },
];

export const FORM_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    EMPLOYEE: ['fullName', 'employeeId'],
    ASSET: ['assetType', 'assetNumber']
  },
  ERROR_MESSAGES: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_DATE: 'Please enter a valid date',
    DUPLICATE_ASSET: 'Asset number already exists for this employee'
  },
  BACKEND_VALIDATION: {
    EMPLOYEE_OPTIONAL: ['department', 'position', 'workLocation'],
    ASSET_OPTIONAL: ['issueDate' /* , 'collectionDate' */]
  }
};

export const TABLE_COLUMNS = {
  NAME: 'name',
  EMPLOYEE_ID: 'employeeId',
  DEPARTMENT: 'department',
  ASSET_TYPE: 'assetType',
  ASSET_NUMBER: 'assetNumber',
  // COLLECTION_DATE: 'collectionDate',
  ACTION: 'action'
};

export const API_ENDPOINTS = {
  CREATE_ASSET: '/add-asset',
  GET_ASSETS: '/allAssets',
  GET_SINGLE_ASSET: '/singleAsset',
  UPDATE_ASSET: '/updateAsset',
  DELETE_ASSET: '/delete',
  GET_ASSETS_BY_EMPLOYEE: '/assets/employee'
};

export const DEFAULT_FORM_STATE = {
  EMPLOYEE: {
    fullName: '',
    employeeId: '',
    department: '',
    position: '',
    workLocation: ''
  },
  ASSET: {
    assetType: '',
    assetNumber: '',
    issueDate: '',
    // collectionDate: ''
  }
};

export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50]
};

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
}; 
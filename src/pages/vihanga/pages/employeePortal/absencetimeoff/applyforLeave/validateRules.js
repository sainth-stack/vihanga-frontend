// validateRules.js
export const leaveFormRules = {
  absenceType: {
    required: true,
    message: "Please select an absence type",
  },
  from: {
    required: true,
    message: "Please select a start date",
  },
  to: {
    required: true,
    message: "Please select an end date",
  },
  note: {
    maxLength: 500,
    message: "Note cannot exceed 500 characters",
  },
  dateRange: {
    type: "dateRange",
    startField: "from",
    endField: "to",
    message: "To date cannot be earlier than From date",
  },
};

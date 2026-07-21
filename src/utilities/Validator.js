// utils/validateForm.js

export const validateForm = (formData, rules) => {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = formData[field];

    // Required check
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = rule.message || `${field} is required`;
      continue;
    }

    // Min length
    if (rule?.minLength && value?.length < rule?.minLength) {
      errors[field] =
        rule.message ||
        `${field} must be at least ${rule?.minLength} characters`;
    }

    // Max length
    if (rule?.maxLength && value?.length > rule?.maxLength) {
      errors[field] =
        rule?.message ||
        `${field} must be less than ${rule?.maxLength} characters`;
    }

    // Date validation
    if (rule.type === "dateRange") {
      const { startField, endField } = rule;
      const startDate = new Date(formData[startField]);
      const endDate = new Date(formData[endField]);

      if (startDate && endDate && endDate < startDate) {
        errors.dateRange =
          rule.message || "End date cannot be before start date";
      }
    }

    // Custom validator
    if (rule.validate && typeof rule.validate === "function") {
      const result = rule.validate(value, formData);
      if (result !== true) {
        errors[field] = result || "Invalid value";
      }
    }
  }

  return errors;
};

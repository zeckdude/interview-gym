export const starterTs = `interface FieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

function validateForm(
  values: Record<string, string>,
  rules: Record<string, FieldRules>
): ValidationResult {
  // Validate each field and collect errors
  return { valid: true, errors: {} };
}

export { validateForm };`;

export const starterJs = `function validateForm(values, rules) {
  // Validate each field and collect errors
  return { valid: true, errors: {} };
}

module.exports = { validateForm };`;

export const solutionTs = `interface FieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

function validateForm(
  values: Record<string, string>,
  rules: Record<string, FieldRules>
) {
  const errors: Record<string, string[]> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field] ?? '';
    const fieldErrors: string[] = [];

    if (fieldRules.required && !value.trim()) {
      fieldErrors.push(\`\${field} is required\`);
    }
    if (fieldRules.minLength !== undefined && value.length < fieldRules.minLength) {
      fieldErrors.push(\`\${field} must be at least \${fieldRules.minLength} characters\`);
    }
    if (fieldRules.maxLength !== undefined && value.length > fieldRules.maxLength) {
      fieldErrors.push(\`\${field} must be at most \${fieldRules.maxLength} characters\`);
    }
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      fieldErrors.push(\`\${field} format is invalid\`);
    }
    if (fieldRules.custom) {
      const msg = fieldRules.custom(value);
      if (msg) fieldErrors.push(msg);
    }

    errors[field] = fieldErrors;
  }

  const valid = Object.values(errors).every((e) => e.length === 0);
  return { valid, errors };
}

export { validateForm };`;

export const solutionJs = `function validateForm(values, rules) {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field] ?? '';
    const fieldErrors = [];

    if (fieldRules.required && !value.trim()) {
      fieldErrors.push(\`\${field} is required\`);
    }
    if (fieldRules.minLength !== undefined && value.length < fieldRules.minLength) {
      fieldErrors.push(\`\${field} must be at least \${fieldRules.minLength} characters\`);
    }
    if (fieldRules.maxLength !== undefined && value.length > fieldRules.maxLength) {
      fieldErrors.push(\`\${field} must be at most \${fieldRules.maxLength} characters\`);
    }
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      fieldErrors.push(\`\${field} format is invalid\`);
    }
    if (fieldRules.custom) {
      const msg = fieldRules.custom(value);
      if (msg) fieldErrors.push(msg);
    }

    errors[field] = fieldErrors;
  }

  const valid = Object.values(errors).every((e) => e.length === 0);
  return { valid, errors };
}

module.exports = { validateForm };`;

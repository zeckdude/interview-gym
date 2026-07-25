export const starterTs = `type FieldType = 'string' | 'number' | 'boolean';

interface FieldSpec {
  type: FieldType;
  required?: boolean;
}

interface SchemaDefinition {
  [key: string]: FieldSpec;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function createSchema(definition: SchemaDefinition) {
  return {
    validate(data: Record<string, unknown>): ValidationResult {
      // Validate data against the schema definition
      return { valid: true, errors: [] };
    },
  };
}

export { createSchema };`;

export const starterJs = `function createSchema(definition) {
  return {
    validate(data) {
      // Validate data against the schema definition
      return { valid: true, errors: [] };
    },
  };
}

module.exports = { createSchema };`;

export const solutionTs = `type FieldType = 'string' | 'number' | 'boolean';

interface FieldSpec {
  type: FieldType;
  required?: boolean;
}

function createSchema(definition: Record<string, FieldSpec>) {
  return {
    validate(data: Record<string, unknown>) {
      const errors: string[] = [];

      for (const [key, spec] of Object.entries(definition)) {
        const value = data[key];
        const missing = value === undefined || value === null;

        if (missing) {
          if (spec.required) errors.push(\`\${key} is required\`);
        } else if (typeof value !== spec.type) {
          errors.push(\`\${key} must be a \${spec.type}\`);
        }
      }

      return { valid: errors.length === 0, errors };
    },
  };
}

export { createSchema };`;

export const solutionJs = `function createSchema(definition) {
  return {
    validate(data) {
      const errors = [];

      for (const [key, spec] of Object.entries(definition)) {
        const value = data[key];
        const missing = value === undefined || value === null;

        if (missing) {
          if (spec.required) errors.push(\`\${key} is required\`);
        } else if (typeof value !== spec.type) {
          errors.push(\`\${key} must be a \${spec.type}\`);
        }
      }

      return { valid: errors.length === 0, errors };
    },
  };
}

module.exports = { createSchema };`;

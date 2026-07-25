export const starterTs = `interface PostInput {
  title: string;
  content: string;
}

interface ActionResult {
  success: boolean;
  errors: Record<string, string>;
}

function createPost(formData: PostInput): ActionResult {
  // Validate title (min 3 chars) and content (min 10 chars).
  // Return { success, errors } — errors only contains failing fields.

  return { success: true, errors: {} };
}

export { createPost };`;

export const starterJs = `function createPost(formData) {
  // Validate title (min 3 chars) and content (min 10 chars).
  // Return { success, errors } — errors only contains failing fields.

  return { success: true, errors: {} };
}

module.exports = { createPost };`;

export const solutionTs = `interface PostInput {
  title: string;
  content: string;
}

interface ActionResult {
  success: boolean;
  errors: Record<string, string>;
}

function createPost(formData: PostInput): ActionResult {
  const errors: Record<string, string> = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!formData.content || formData.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters';
  }

  return { success: Object.keys(errors).length === 0, errors };
}

export { createPost };`;

export const solutionJs = `function createPost(formData) {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!formData.content || formData.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters';
  }

  return { success: Object.keys(errors).length === 0, errors };
}

module.exports = { createPost };`;

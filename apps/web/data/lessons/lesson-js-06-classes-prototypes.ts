import type { Lesson } from './types';
import { runUserCode, testCases } from './_utils';

export const lessonJs06ClassesPrototypes: Lesson = {
  id: 'lesson-js-06-classes-prototypes',
  title: 'Classes & Prototypes',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  sequenceOrder: 27,
  relatedChallengeIds: ['fe-11-observer-pattern'],
  estimatedMinutes: 15,
  concepts: ['classes', 'prototypes', 'constructor', 'extends'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Senior interviews ask how JavaScript **inheritance** works under the hood — not just \`class\` syntax. React class components (legacy codebases), custom error types, and event emitters all use classes or prototype chains.

You need both modern \`class\` syntax and the prototype model that powers it.
      `,
    },
    {
      type: 'explanation',
      title: 'How Classes & Prototypes Work',
      content: `
**class** is syntactic sugar over prototypes:

\`\`\`javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}
\`\`\`

Every object has an internal \`[[Prototype]]\` link. Methods live on \`Animal.prototype\`; instances delegate to it.

**extends** sets up the prototype chain for subclasses. \`super()\` must run in child constructors before using \`this\`.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
}

new Rectangle(4, 5).area(); // 20`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }
}

// Prototype check
const r = new Rectangle(2, 3);
r instanceof Rectangle; // true
Object.getPrototypeOf(r) === Rectangle.prototype; // true`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"JavaScript has classical inheritance."** Wrong — it's **prototypal**. \`class extends\` sets up prototype delegation, not copies like Java/C++.

**Forgetting \`super()\` in subclass constructor** — \`this\` is invalid until \`super()\` runs.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Classes',
      content: `
**Simple data + functions** — plain objects and factory functions (\`createCounter\`) are often simpler.

**React new code** — prefer function components + hooks over class components.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-js-06-classes-prototypes',
    prompt: `Implement \`createRect(width, height)\` — return an object with \`area()\` method (factory pattern).`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createRect(width, height) {
  // Implement this function
  
}`,
      typescript: `function createRect(width: number, height: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createRect(width, height) {
  return {
    width,
    height,
    area() { return this.width * this.height; },
  };
}`,
      typescript: `function createRect(width: number, height: number) {
  return {
    width,
    height,
    area() { return this.width * this.height; },
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(w: number, h: number) => { area: () => number }>(userCode, 'createRect');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      const rect = result.value(4, 5);
      return testCases([{ actual: rect.area(), expected: 20 }]);
    },
  },
  mdnLinks: [
    { label: 'Classes — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes' },
    { label: 'Inheritance and the prototype chain — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};

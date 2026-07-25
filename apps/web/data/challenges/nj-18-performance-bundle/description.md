## The Challenge

Implement `auditImports(lines: string[])` returning issues found in import lines:

- Top-level `import Chart from 'heavy-chart'` → `dynamic-import`
- `import fs from 'fs'` in client file → `server-only-in-client`
- `<script src=` without strategy → `blocking-script`
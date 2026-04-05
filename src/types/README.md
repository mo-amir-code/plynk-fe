# Type System Rules

- Define all new TypeScript types only in `src/types`.
- Mirror source folder structure and use exactly one barrel per folder:
  - `src/components/dir1/*` -> `src/types/components/dir1/index.ts`
  - `src/app/home/*` -> `src/types/app/home/index.ts`
  - `src/lib/*` -> `src/types/lib/index.ts`
- Do not create per-file type modules.
- Components/pages/hooks/utils import types from folder barrels only (for example `@/types/components/dir1`).
- Components/pages/hooks/utils must not declare interfaces/type aliases/enums inline.
- Prefer reusable shared types in `src/types/common` when multiple modules need the same shape.

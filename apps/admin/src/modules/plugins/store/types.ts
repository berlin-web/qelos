import { getCrud } from '@/services/crud';

export interface IMetaCrud {
  api: ReturnType<typeof getCrud>
  identifierKey: string,
  navigateAfterSubmit?: {
    name: string,
    params: Record<string, string>,
    query: Record<string, string>,
  },
  clearAfterSubmit?: boolean,
}

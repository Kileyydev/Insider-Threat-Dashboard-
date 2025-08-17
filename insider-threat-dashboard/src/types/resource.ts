// types/resource.ts
export type AccessLevel = 'open' | 'restricted' | 'full_control' | 'none' | 'upload' | 'download' | 'delete';

export interface ResourceDto {
  id: number;
  name: string;
  path: string;
  is_folder: boolean;
  department: number | string; // depending on your serializer
  created_by: string | null;
  created_at: string;
}

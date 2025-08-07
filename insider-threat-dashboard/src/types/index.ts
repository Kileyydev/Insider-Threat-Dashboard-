// src/types/index.ts

export interface EmployeeUser {
  id: number;
  name: string;
  department: string;
  role: string;
  employee: {
    username: string;
    email: string;
  };
}

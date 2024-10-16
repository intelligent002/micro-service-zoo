export interface Task {
  id: number;
  project_id: number;
  priority: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  isEditing: boolean;
}

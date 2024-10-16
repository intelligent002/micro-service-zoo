export interface Project {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  isExpanded: boolean;
  isEditing: boolean;
  gotTasks: boolean;
}

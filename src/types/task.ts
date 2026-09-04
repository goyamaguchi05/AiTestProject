export const taskStatuses = ['未着手', '進行中', '完了'] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export type Task = {
  id: number;
  user_id: string;
  task_name: string;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
};
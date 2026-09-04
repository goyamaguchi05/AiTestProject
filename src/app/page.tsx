import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './logout-button';
import type { Task } from '@/types/task';

const statusStyles: Record<Task['status'], string> = {
  未着手: 'bg-slate-100 text-slate-700',
  進行中: 'bg-amber-100 text-amber-800',
  完了: 'bg-emerald-100 text-emerald-800',
};

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('id, user_id, task_name, due_date, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const tasks = (data ?? []) as Task[];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-teal-600">TASKS</p>
            <h1 className="mt-1 text-3xl font-bold">タスク一覧</h1>
          </div>
          <LogoutButton />
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-6 text-sm text-red-700">タスクの取得に失敗しました。</p>
          ) : tasks.length === 0 ? (
            <p className="p-6 text-slate-500">タスクはありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">タスク名</th>
                    <th className="px-6 py-4">期日</th>
                    <th className="px-6 py-4">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{task.task_name}</td>
                      <td className="px-6 py-4 text-slate-600">{task.due_date ?? '期日なし'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

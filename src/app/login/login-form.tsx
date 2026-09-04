'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function getJapaneseAuthError(message: string): string {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'メールアドレスまたはパスワードが正しくありません。';
  }
  if (message.toLowerCase().includes('user already registered')) {
    return 'このメールアドレスはすでに登録されています。';
  }
  if (message.toLowerCase().includes('password')) {
    return 'パスワードは6文字以上で入力してください。';
  }
  return '認証に失敗しました。入力内容を確認してもう一度お試しください。';
}

export default function LoginForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const result = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        if (!isSignUp) {
          console.error('ログインエラー:', result.error.message);
        }
        setMessage(getJapaneseAuthError(result.error.message));
      } else if (isSignUp && !result.data.session) {
        setMessage('確認メールを送信しました。メール内のリンクを開いてください');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setMessage('通信に失敗しました。時間をおいてもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest text-teal-600">TASKS</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{isSignUp ? 'アカウント登録' : 'ログイン'}</h1>
        <p className="mt-2 text-sm text-slate-500">タスクを確認して、今日の仕事を始めましょう。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          メールアドレス
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          パスワード
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
        {message && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (isSignUp ? '新規登録中...' : 'ログイン中...') : isSignUp ? '新規登録' : 'ログイン'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignUp((current) => !current);
          setMessage('');
        }}
        className="mt-6 w-full text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        {isSignUp ? 'ログイン画面へ戻る' : 'アカウントを新規登録する'}
      </button>
    </div>
  );
}
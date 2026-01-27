interface LoginFormProps {
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ password, setPassword, onSubmit }: LoginFormProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg border">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в админ-панель</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Введите пароль"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

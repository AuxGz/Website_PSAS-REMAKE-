import { login, signup, signInWithOAuth } from './actions'
import { SubmitButton } from './submit-button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>
}) {
  const { message, error } = await searchParams;
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] px-4 font-sans selection:bg-zinc-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            SummitX<span className="text-zinc-500">Gear</span>
          </h1>
          <p className="mt-3 text-zinc-400">Sign in to your account to continue</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-zinc-300" htmlFor="password">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-500 border border-emerald-500/20">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <SubmitButton
                formAction={login}
                pendingText="Signing In..."
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign In
              </SubmitButton>
              <SubmitButton
                formAction={signup}
                pendingText="Creating Account..."
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </SubmitButton>
            </div>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121212] px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <form>
            <div className="grid grid-cols-3 gap-3">
              <SubmitButton
                formAction={signInWithOAuth.bind(null, 'google')}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                title="Google"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </SubmitButton>

              <SubmitButton
                formAction={signInWithOAuth.bind(null, 'discord')}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                title="Discord"
              >
                <svg className="h-8 w-8 translate-y-[3px]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19.27 4.57C17.75 3.86 16.12 3.35 14.41 3.06c-.21.37-.43.83-.6 1.22-1.84-.28-3.66-.28-5.46 0-.17-.39-.41-.85-.61-1.22-1.71.3-3.34.8-4.86 1.51C1.04 7.26-.06 9.87.01 12.44c2.12 1.56 4.15 2.5 6.13 3.11.5-.68.94-1.42 1.3-2.2-.72-.27-1.41-.62-2.06-1.05.17-.12.33-.25.49-.39 3.99 1.84 8.31 1.84 12.25 0 .16.14.32.27.49.39-.65.43-1.34.78-2.06 1.05.36.78.8 1.52 1.3 2.2 1.98-.61 4.01-1.55 6.13-3.11.08-3.03-1.01-5.61-3.28-7.87zM8.2 12.1c-1.18 0-2.15-1.08-2.15-2.42s.94-2.42 2.15-2.42c1.21 0 2.17 1.08 2.15 2.42 0 1.34-.94 2.42-2.15 2.42zm7.6 0c-1.18 0-2.15-1.08-2.15-2.42s.94-2.42 2.15-2.42c1.21 0 2.17 1.08 2.15 2.42 0 1.34-.94 2.42-2.15 2.42z" />
                </svg>
              </SubmitButton>

              <SubmitButton
                formAction={signInWithOAuth.bind(null, 'facebook')}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                title="Facebook"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.97 3.64 9.08 8.4 9.83v-6.95h-2.53v-2.88h2.53v-2.2c0-2.5 1.49-3.87 3.76-3.87 1.08 0 2.22.2 2.22.2v2.44h-1.25c-1.24 0-1.63.77-1.63 1.56v1.87h2.75l-.44 2.88h-2.31v6.95c4.76-.75 8.4-4.86 8.4-9.83 0-5.5-4.46-9.96-9.96-9.96z" />
                </svg>
              </SubmitButton>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-zinc-300 underline underline-offset-4 hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-zinc-300 underline underline-offset-4 hover:text-white">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  )
}

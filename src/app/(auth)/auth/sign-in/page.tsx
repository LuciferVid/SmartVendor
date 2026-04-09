import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl">
              SV
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">SmartVendor</h1>
          <p className="text-slate-600">
            Sign in to your workspace
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}

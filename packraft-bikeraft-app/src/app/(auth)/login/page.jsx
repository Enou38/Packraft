import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Connexion</h1>
      <LoginForm />
    </div>
  );
}
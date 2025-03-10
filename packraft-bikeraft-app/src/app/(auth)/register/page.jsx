import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Créer un compte</h1>
      <RegisterForm />
    </div>
  );
}
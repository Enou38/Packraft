import CreateTraceForm from '@/components/forms/CreateTraceForm';

export default function CreateTracePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ajouter un nouveau parcours</h1>
      <p className="text-gray-600">
        Partagez votre parcours de packraft ou bikeraft avec la communauté. 
        Vous devez être connecté pour ajouter un parcours.
      </p>
      <CreateTraceForm />
    </div>
  );
}
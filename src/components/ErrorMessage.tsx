import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="card bg-red-50 border border-red-200">
      <div className="flex items-center gap-3 text-red-800">
        <AlertCircle size={24} />
        <p>{message}</p>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { CardEditor } from '@/presentation/components/CardEditor';
import { ArrowLeft } from 'lucide-react';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          返回首頁
        </Link>
        
        <CardEditor />
      </div>
    </div>
  );
}

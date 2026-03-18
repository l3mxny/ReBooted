'use client';

import { useParams } from 'next/navigation';
import { ModuleId } from '@/lib/types';
import LearningModule from '@/components/LearningModule';

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.moduleId as ModuleId;

  return <LearningModule moduleId={moduleId} />;
}

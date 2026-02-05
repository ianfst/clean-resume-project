import { useParams } from 'react-router-dom';
import { ResumeBuilderShell } from '@/components/resume-builder/ResumeBuilderShell';

export default function InterviewPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <ResumeBuilderShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No project selected</p>
        </div>
      </ResumeBuilderShell>
    );
  }

  return (
    <ResumeBuilderShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Practice</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Practice interview questions tailored to your resume and target role
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Interview practice feature has been removed.</p>
        </div>
      </div>
    </ResumeBuilderShell>
  );
}

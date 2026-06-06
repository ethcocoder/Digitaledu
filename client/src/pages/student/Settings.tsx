import StudentLayout from '@/components/StudentLayout';
import UserSettingsPanel from '@/components/UserSettingsPanel';

export default function StudentSettings() {
  return (
    <StudentLayout title="Settings">
      <UserSettingsPanel accent="yellow" />
    </StudentLayout>
  );
}

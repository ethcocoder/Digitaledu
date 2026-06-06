import InstructorLayout from '@/components/InstructorLayout';
import UserSettingsPanel from '@/components/UserSettingsPanel';

export default function InstructorSettings() {
  return (
    <InstructorLayout title="Settings">
      <UserSettingsPanel accent="teal" />
    </InstructorLayout>
  );
}

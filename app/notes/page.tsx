import MainLayout from "@/components/main-layout";
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return (
    <MainLayout>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </MainLayout>
  );
}
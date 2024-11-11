import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/custom/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ClerkUser } from '@/types';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();
  let clerkUser: ClerkUser | undefined;
  if (!userId || !user) {
    clerkUser = undefined;
  } else {
    clerkUser = {
      id: userId,
      email: user?.emailAddresses[0].emailAddress,
    };
  }
  const cookieStore = await cookies();

  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={clerkUser} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

// app/[locale]/account/indexnow/page.tsx
"use client";

import IndexNowSubmitter from '@/components/IndexNowSubmitter';
import AdminMenu from "@/components/admin-dashboard/menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function IndexNowPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.is_superuser) {
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <div>
      <AdminMenu />
      <IndexNowSubmitter />
    </div>
  );
}

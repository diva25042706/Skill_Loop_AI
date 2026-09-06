"use client"
import AppLayout from "@/components/layout/AppLayout"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout role="TEACHER">{children}</AppLayout>
}

'use client';

interface Props {
  children: React.ReactNode;
}

export default function ProjectsLayout({ children }: Props) {
  // Middleware handles authentication, so we can directly render children
  return <>{children}</>;
}
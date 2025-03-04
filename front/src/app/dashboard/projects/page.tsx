"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthAwareLayout";

const ProjectsPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div>Projects</div>
  );
};

export default ProjectsPage;
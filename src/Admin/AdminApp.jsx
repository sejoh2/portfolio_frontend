import { useState } from "react";
import { getToken } from "./api";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import HeroImagesAdmin from "./sections/HeroImagesAdmin";
import BuildItemsAdmin from "./sections/BuildItemsAdmin";
import SkillGroupsAdmin from "./sections/SkillGroupsAdmin";
import EducationAdmin from "./sections/EducationAdmin";
import CertificationsAdmin from "./sections/CertificationsAdmin";
import ExperienceAdmin from "./sections/ExperienceAdmin";
import ProjectsAdmin from "./sections/ProjectsAdmin";
import ContactProfileAdmin from "./sections/ContactProfileAdmin";

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));
  const [activeSection, setActiveSection] = useState("hero");

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const sections = {
    hero: <HeroImagesAdmin />,
    build: <BuildItemsAdmin />,
    skills: <SkillGroupsAdmin />,
    education: <EducationAdmin />,
    certifications: <CertificationsAdmin />,
    experience: <ExperienceAdmin />,
    projects: <ProjectsAdmin />,
    contact: <ContactProfileAdmin />,
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onLogout={() => setIsAuthenticated(false)}
    >
      {sections[activeSection]}
    </AdminLayout>
  );
};

export default AdminApp;
import Profile from "@/components/directories/about/profile";
import Contact from "@/components/directories/about/contact";
import Certifications from "@/components/directories/academics/certifications";
import Research from "@/components/directories/academics/research";
import Technical from "@/components/directories/expertise/technical";
import SoftSkills from "@/components/directories/expertise/soft-skills";

export const directoryStructure = {
  "/": [
    { name: "about", isDirectory: true },
    { name: "academics", isDirectory: true },
    { name: "expertise", isDirectory: true },
  ],
  "/about": [
    { name: "profile", isDirectory: false, component: <Profile /> },
    { name: "contact", isDirectory: false, component: <Contact /> },
  ],
  "/academics": [
    {
      name: "certifications",
      isDirectory: false,
      component: <Certifications />,
    },
    { name: "research", isDirectory: false, component: <Research /> },
  ],
  "/expertise": [
    { name: "technical", isDirectory: false, component: <Technical /> },
    { name: "soft-skills", isDirectory: false, component: <SoftSkills /> },
  ],
};

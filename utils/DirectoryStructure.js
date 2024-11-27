import Profile from "@/components/directories/about/profile";
import Contact from "@/components/directories/about/contact";

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
    { name: "certifications", isDirectory: false, component: "<School />" },
    { name: "research", isDirectory: false, component: "<College />" },
  ],
  "/expertise": [
    { name: "technical", isDirectory: false, component: "<Coding />" },
    { name: "soft-skills", isDirectory: false, component: "<Design />" },
  ],
};

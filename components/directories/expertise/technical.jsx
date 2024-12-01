import React from "react";

export default function Technical() {
  return (
    <div className="pt-4">
      <h4 className="text-sm font-medium">Development technologies:</h4>
      <ul className="list-disc list-inside">
        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Frameworks & Libraries: </span>Spring,
          Spring Boot, NodeJs, NextJs, React, Express
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Database: </span>MySQL, MongoDB,
          Prisma, Mongoose
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Backend Services: </span> Sanity.io,
          PocketBase, SupaBase, FireBase
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">UI/UX Design: </span> Figma
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Additional: </span> WordPress,
          GoogleApp Script, Tailwind CSS
        </li>
      </ul>
      <h4 className="pt-2 text-sm font-medium">Operational:</h4>
      <ul className="list-disc list-inside">
        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Project Version Control: </span>Git,
          GitHub
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Servers: </span>Apache, NGINX
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Cloud Platforms: </span> Netlify,
          Vercel, Mongo Atlas
        </li>
      </ul>
      <h4 className="pt-2 text-sm font-medium">Programmistic:</h4>
      <p className="text-xs">
        Good knowledge of algorithms and data structures, Java, JavaScript,
        Python. Strong problem solving skills
      </p>
    </div>
  );
}

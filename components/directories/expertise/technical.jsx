import React from "react";

export default function Technical() {
  return (
    <div className="pt-4">
      <h4 className="text-sm font-medium">Development Technologies:</h4>
      <ul className="list-disc list-inside">
        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Frameworks & Libraries: </span>
          Spring, Spring Boot, Node.js, Next.js, React, Express
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Databases & ORMs: </span>
          MySQL, PostgreSQL, MongoDB, Prisma, Mongoose
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Backend & Services: </span>
          Supabase, Firebase, Sanity, PocketBase
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">UI/UX Design: </span>
          Figma, Tailwind CSS
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Additional Tools: </span>
          WordPress, Google Apps Script
        </li>
      </ul>

      <h4 className="pt-2 text-sm font-medium">Operational:</h4>
      <ul className="list-disc list-inside">
        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Version Control: </span>
          Git, GitHub
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Servers & Deployment: </span>
          Apache, NGINX, PM2
        </li>

        <li className="marker:text-blue-600 text-xs">
          <span className="font-semibold">Cloud Platforms: </span>
          Vercel, Netlify, AWS (S3, RDS), MongoDB Atlas
        </li>
      </ul>

      <h4 className="pt-2 text-sm font-medium">Programming:</h4>
      <p className="text-xs">
        Strong problem-solving skills with solid knowledge of algorithms and
        data structures. Proficient in JavaScript, TypeScript, and Java; working
        knowledge of Python.
      </p>
    </div>
  );
}

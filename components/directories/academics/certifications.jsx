import React from "react";
import { certifications } from "@/utils/data/academics";

export default function Certifications() {
  return (
    <div className="pt-2">
      {certifications.map((item, id) => (
        <div className="pt-2" key={id}>
          <h4>{item.institute}</h4>
          <p>{item.degree}</p>
        </div>
      ))}
    </div>
  );
}

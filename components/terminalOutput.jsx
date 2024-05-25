import React from "react";
import UserData from "./userData";

export default function TerminalOutput({
  output,
  currentDirectory,
  showProfile,
}) {
  return (
    <div className="mb-4 overflow-y-auto h-72">
      {output.map((line, index) => (
        <p key={index} className="text-white text-sm">
          {line}
        </p>
      ))}
      {currentDirectory === "/profile" && showProfile ? <UserData /> : null}
    </div>
  );
}

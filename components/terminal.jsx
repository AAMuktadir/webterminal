"use client";
import React, { useState, useEffect } from "react";
import TerminalHeader from "./terminalHeader";
import TerminalInput from "./terminalInput";
import TerminalOutput from "./terminalOutput";
import { getHelpCommands } from "@/data/helpCommands";

export default function Terminal() {
  const [output, setOutput] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentDirectory, setCurrentDirectory] = useState("/");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setOutput([...getHelpCommands]);
  }, []);

  const handleCommand = (command) => {
    const newOutput = [...output];
    switch (command.toLowerCase()) {
      case "ls":
        newOutput.push("profile, education, skills");
        break;

      case "cd profile":
        if (currentDirectory === "/") {
          setCurrentDirectory("/profile");

          newOutput.push("Switched to profile directory");
        } else {
          newOutput.push("You are already in the profile directory");
        }
        setShowProfile(true);
        break;
      // Add more cases for other commands (e.g., "cd profile")

      case "cd ..":
        if (currentDirectory !== "/") {
          setCurrentDirectory("/");
          newOutput.push("Moved back a directory");
        } else {
          newOutput.push("You are already in the root directory");
        }
        break;

      case "help":
        newOutput.push(...getHelpCommands);
        break;
      case "clear":
        setOutput([]);
        return;
      default:
        newOutput.push(`Command not found: ${command}`);
    }
    setOutput(newOutput);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCommand(userInput);
      setUserInput("");
    } else if (event.ctrlKey && event.key === "l") {
      setOutput([]);
      setShowProfile(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/background/background_large.jpeg')]">
      <div className="terminal bg-gray-800 opacity-90 p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <TerminalHeader />
        <TerminalOutput
          output={output}
          currentDirectory={currentDirectory}
          showProfile={showProfile}
        />
        <TerminalInput
          userInput={userInput}
          setUserInput={setUserInput}
          handleKeyDown={handleKeyDown}
          currentDirectory={currentDirectory}
        />
      </div>
    </div>
  );
}

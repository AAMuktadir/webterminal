"use client";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import UserData from "./userData";
import { getHelpCommands } from "@/data/helpCommands";

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentDirectory, setCurrentDirectory] = useState("/");
  const [showProfile, setShowProfile] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setOutput([...getHelpCommands]);
    inputRef.current.focus();
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

  const getDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/background/background_large.jpeg')]">
      <div className="terminal bg-gray-800 opacity-90 p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-white text-sm">{getDate()}</div>
        </div>
        <div className="mb-4 overflow-y-auto h-72">
          {output.map((line, index) => (
            <p key={index} className="text-white text-sm">
              {line}
            </p>
          ))}
          {currentDirectory === "/profile" && showProfile ? <UserData /> : null}
        </div>
        <div className="flex items-center">
          <span className="text-white text-sm mr-2">
            ~/muktadir/portfolio{currentDirectory}$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-800 text-white outline-none rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

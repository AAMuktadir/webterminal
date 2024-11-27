"use client";
import React, { useState, useEffect } from "react";
import TerminalHeader from "./terminalHeader";
import TerminalInput from "./terminalInput";
import TerminalOutput from "./terminalOutput";
import { getHelpCommands } from "@/utils/data/helpCommands";
import { directoryStructure } from "@/utils/DirectoryStructure";

export default function Terminal() {
  const [output, setOutput] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentDirectory, setCurrentDirectory] = useState("/");

  useEffect(() => {
    setOutput([...getHelpCommands]);
  }, []);

  const checkCommand = (input) =>
    input.startsWith("cd ")
      ? `no such file or directory: ${input}`
      : `Command not found: ${input}`;

  const handleCommand = (command) => {
    const newOutput = [...output];
    newOutput.push(`~/muktadir/portfolio${currentDirectory}$ ${command}`);
    const commandParts = command.split(" ");
    const action = commandParts[0];
    const target = commandParts[1];

    const isLeafNode = !directoryStructure[currentDirectory]; // No further directories or files in the current path.

    switch (action.toLowerCase()) {
      case "ls":
        if (isLeafNode) {
          newOutput.push("No files or directories in this location.");
        } else if (directoryStructure[currentDirectory]) {
          newOutput.push(
            directoryStructure[currentDirectory]
              .map((item) => item.name)
              .join(", ")
          );
        } else {
          newOutput.push("No files or directories found.");
        }
        break;

      case "cd":
        if (target === "..") {
          if (currentDirectory !== "/") {
            const parentDir =
              currentDirectory.substring(
                0,
                currentDirectory.lastIndexOf("/")
              ) || "/";
            setCurrentDirectory(parentDir);
            newOutput.push(`Moved back to ${parentDir}`);
          } else {
            newOutput.push("You are already in the root directory");
          }
        } else if (isLeafNode) {
          newOutput.push("Cannot navigate further from a file.");
        } else {
          const targetItem = directoryStructure[currentDirectory]?.find(
            (item) => item.name === target
          );

          if (targetItem) {
            if (targetItem.isDirectory) {
              // Navigate to a directory
              const newDir = `${
                currentDirectory === "/" ? "" : currentDirectory
              }/${target}`;
              setCurrentDirectory(newDir);
              newOutput.push(`Switched to ${newDir} directory`);
            } else {
              // Handle leaf files (render component)
              const newDir = `${
                currentDirectory === "/" ? "" : currentDirectory
              }/${target}`;
              setCurrentDirectory(newDir);
              newOutput.push(`Opened ${target}`);
              newOutput.push(targetItem.component);
            }
          } else {
            newOutput.push(`'${target}' does not exist in ${currentDirectory}`);
          }
        }
        break;

      case "help":
        newOutput.push(...getHelpCommands);
        break;

      case "clear":
        setOutput([]);
        return;

      default:
        newOutput.push(checkCommand(command));
    }
    setOutput(newOutput);
  };

  const handleTabCompletion = () => {
    const commandParts = userInput.split(" ");
    if (commandParts[0] === "cd" && commandParts[1]) {
      const partialName = commandParts[1];

      // Find matching directories in the current directory
      const matches = directoryStructure[currentDirectory]?.filter((item) =>
        item.name.startsWith(partialName)
      );

      if (matches && matches.length === 1) {
        // If there's exactly one match, complete the command
        setUserInput(`cd ${matches[0].name}`);
      } else if (matches && matches.length > 1) {
        // If multiple matches, show suggestions
        setOutput((prev) => [
          ...prev,
          `Suggestions: ${matches.map((item) => item.name).join(", ")}`,
        ]);
      } else {
        // If no matches, do nothing (or optionally, show a message)
        setOutput((prev) => [
          ...prev,
          `"${partialName}" not found in ${currentDirectory}`,
        ]);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCommand(userInput);
      setUserInput("");
    } else if (event.ctrlKey && event.key === "l") {
      setOutput([]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      handleTabCompletion();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/background/background_large.jpeg')]">
      <div className="terminal bg-gray-800 opacity-90 p-4 rounded-lg shadow-lg w-full max-w-2xl">
        <TerminalHeader />
        <TerminalOutput output={output} />
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

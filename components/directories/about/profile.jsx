import Image from "next/image";

import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col items-center mt-4 px-8">
      <Image
        src={"/img/myPhoto.png"}
        height={100}
        width={100}
        alt="Profile Photo"
        className="w-32 h-32 rounded-full object-cover"
      />
      <h3 className="text-white text-lg font-semibold mt-2">
        Abdullah Al Muktadir
      </h3>

      <h4 className="text-sm font-light text-green-500">Software Engineer</h4>

      <p className="text-white pt-4 text-center">
        A Full-Stack Developer with a passion for solving complex problems,
        exploring innovative solutions, and adapting skills to address
        challenges across diverse sectors.
      </p>
    </div>
  );
};

export default Profile;

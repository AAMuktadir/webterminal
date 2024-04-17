import Image from "next/image";

import React from "react";

const UserData = () => {
  return (
    <div className="flex flex-col items-center mt-4">
      <Image
        src={"/img/myPhoto.png"}
        height={60}
        width={60}
        alt="Profile Photo"
        className="w-20 h-20 rounded-full object-cover"
      />
      <p className="text-white text-lg font-semibold mt-2">Muktadir</p>
    </div>
  );
};

export default UserData;

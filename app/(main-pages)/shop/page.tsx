import React from "react";
// import Image from "next/image";

export default function Shop() {
  return (
    <div className="-mt-9 px-4 flex flex-col items-center gap-6">
      {/* <Image
        src="/under_construction.svg"
        alt="Shop Image"
        width={300}
        height={100}
        className="w-72 h-auto object-contain"
      /> */}
      <h1 className="pt-32 text-center text-[#233259] text-5xl lg:text-7xl font-medium">
        We are Coming Soon!!!
      </h1>
      <p className="text-center text-[#6C6C6C] text-lg lg:text-2xl font-(family-name:--font-roboto)">
        Stay tuned for something amazing
      </p>
    </div>
  );
}

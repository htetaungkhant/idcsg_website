import React from "react";

import { cn } from "@/lib/utils";

interface CardCollectionStyle1Props {
  title: string | React.ReactNode;
  imageTitle: string;
  image: string;
  bgCardColor?: string;
  className?: string;
  children?: React.ReactNode;
}
export const CardCollectionStyle1: React.FC<CardCollectionStyle1Props> = ({
  title,
  imageTitle,
  image,
  bgCardColor,
  className,
  children,
}) => {
  return (
    <div className={cn("relative flex", className)}>
      <div
        className={cn(
          "absolute bottom-0 right-0 h-[95%] w-[95%] bg-gradient-to-b from-[#CFD369] to-[#7D812E] rounded-2xl shadow-lg",
          bgCardColor
        )}
      />
      <div className="flex-1 mb-14 flex flex-col gap-y-3 bg-white text-[#233259] px-4 py-5 rounded-2xl shadow-lg relative">
        {title &&
          (typeof title === "string" ? (
            <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl text-center">
              {title}
            </h3>
          ) : (
            title
          ))}
        {children}
      </div>
      <div
        className="relative flex-1 bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg -ml-4 -mt-10 mb-8 mr-6 min-h-100"
        style={{ backgroundImage: `url('${image}')` }}
      >
        {imageTitle && (
          <h2 className="text-4xl text-white px-4 py-3 h-24 bg-gradient-to-b from-[#000000] to-[#00000000] rounded-t-2xl">
            {imageTitle}
          </h2>
        )}
      </div>
    </div>
  );
};

interface CardCollectionStyle2Props {
  title: string | React.ReactNode;
  imageTitle: string;
  image: string;
  bgCardColor?: string;
  className?: string;
  children?: React.ReactNode;
}
export const CardCollectionStyle2: React.FC<CardCollectionStyle2Props> = ({
  title,
  imageTitle,
  image,
  bgCardColor,
  className,
  children,
}) => {
  return (
    <div className={cn("relative flex", className)}>
      <div
        className={cn(
          "absolute top-0 left-0 h-[95%] w-[95%] bg-gradient-to-b from-[#CA4E48] to-[#642724] rounded-2xl shadow-lg",
          bgCardColor
        )}
      />
      <div className="w-[40%] min-w-[300px] -mb-10 mt-28 ml-10 flex flex-col gap-y-3 bg-white text-[#233259] px-4 py-5 rounded-2xl shadow-lg relative z-10">
        {title &&
          (typeof title === "string" ? (
            <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl text-center">
              {title}
            </h3>
          ) : (
            title
          ))}
        {children}
      </div>
      <div
        className="absolute top-10 right-0 w-[75%] h-[90%] bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg min-h-100"
        style={{ backgroundImage: `url('${image}')` }}
      >
        {imageTitle && (
          <h2 className="text-4xl text-white px-4 py-3 h-full w-[50%] min-w-100 bg-gradient-to-r from-[#000000] to-[#00000000] rounded-l-2xl">
            {imageTitle}
          </h2>
        )}
      </div>
    </div>
  );
};

interface CardCollectionStyle3Props {
  title: string | React.ReactNode;
  imageTitle: string;
  image: string;
  bgCardColor?: string;
  className?: string;
  children?: React.ReactNode;
}
export const CardCollectionStyle3: React.FC<CardCollectionStyle3Props> = ({
  title,
  imageTitle,
  image,
  bgCardColor,
  className,
  children,
}) => {
  return (
    <div className={cn("relative py-14 flex justify-center", className)}>
      <div
        className={cn(
          "absolute top-0 h-full w-[90%] bg-gradient-to-r from-[#314765] to-[#2E374E]",
          bgCardColor
        )}
      />
      <div className="w-full flex items-center">
        <div
          className="flex-1 min-h-100 bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg z-10"
          style={{ backgroundImage: `url('${image}')` }}
        >
          {imageTitle && (
            <h2 className="text-4xl text-white px-4 py-3 h-24 bg-gradient-to-b from-[#000000] to-[#00000000] rounded-t-2xl">
              {imageTitle}
            </h2>
          )}
        </div>
        <div className="-ml-6 flex-1 flex flex-col gap-y-3 bg-white text-[#233259] px-4 py-5 pl-12 rounded-2xl shadow-lg relative">
          {title &&
            (typeof title === "string" ? (
              <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl text-center">
                {title}
              </h3>
            ) : (
              title
            ))}
          {children}
        </div>
      </div>
    </div>
  );
};

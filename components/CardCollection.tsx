import React from "react";
import Link from "next/link";
import Image from "next/image";

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
            <h2 className="text-4xl text-white px-4 py-3 min-h-24 bg-gradient-to-b from-[#000000] to-[#00000000] rounded-t-2xl">
              <span className="block w-[90%]">{imageTitle}</span>
            </h2>
          )}
        </div>
        <div className="-ml-6 flex-1 flex flex-col gap-y-3 bg-white text-[#233259] px-4 py-5 pl-12 rounded-2xl shadow-lg relative">
          {title &&
            (typeof title === "string" ? (
              <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl">
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

interface CardCollectionStyle4Props {
  imageUrl: string;
  imageTitle?: string;
  overviewTitle?: string;
  overviewDescription: string;
  detailLink?: string;
  className?: string;
}
export const CardCollectionStyle4: React.FC<CardCollectionStyle4Props> = ({
  imageUrl,
  imageTitle,
  overviewTitle,
  overviewDescription,
  detailLink,
  className,
}) => {
  return (
    <div className={cn("mt-12 flex relative", className)}>
      <div className="absolute w-[90%] h-[75%] inset-0 bg-gradient-to-r from-[#CA4E48] to-[#642724] rounded-3xl"></div>

      <div className="relative max-w-72 pl-5 py-5 pr-3 flex flex-col gap-y-4">
        {detailLink && (
          <Link
            href={detailLink}
            className="px-2 pt-3 pb-1.5 flex flex-col gap-3 items-end bg-[#68211E] border border-[#650F0F] rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-3xl hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-white text-3xl xl:text-4xl">
              Click Here to view more details
            </h2>
            <div className="max-w-[40px] max-h-[40px] xl:max-w-[52px] xl:max-h-[52px] bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 -rotate-90 text-8xl">
              <svg
                className="w-full h-full text-[#C64C46] transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>
          </Link>
        )}
        <div className="z-10 w-100 xl:w-130 ml-12 flex flex-col gap-y-2 xl:gap-y-4 text-[#233259] bg-white px-5 py-3 rounded-3xl shadow-lg font-(family-name:--font-ubuntu)">
          {overviewTitle && (
            <h3 className="text-center text-2xl xl:text-4xl font-bold">
              {overviewTitle}
            </h3>
          )}
          <p
            className="text-base lg:text-xl xl:text-2xl leading-9 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: overviewDescription }}
          />
        </div>
      </div>
      <div className="relative flex-1 mt-16">
        <h1 className="absolute top-0 left-0 text-white text-6xl w-[85%] xl:w-[50%] h-[85%] bg-gradient-to-r from-[#000000] to-[#00000000] rounded-l-2xl px-4 py-3">
          {imageTitle}
        </h1>
        <Image
          src={imageUrl || "/little_boy_dentist.jpg"}
          alt="Card Image"
          width={500}
          height={500}
          className="w-full h-[85%] rounded-3xl shadow-lg object-cover"
          priority
        />
      </div>
    </div>
  );
};

interface CardCollectionStyle5Props {
  imageUrl: string;
  imageTitle?: string;
  overviewTitle?: string;
  overviewDescription: string;
  detailLink?: string;
  className?: string;
}
export const CardCollectionStyle5: React.FC<CardCollectionStyle5Props> = ({
  imageUrl,
  imageTitle,
  overviewTitle,
  overviewDescription,
  detailLink,
  className,
}) => {
  return (
    <div className={cn("mt-12 w-full flex relative", className)}>
      <div className="absolute bottom-0 right-0 w-[90%] h-[85%] flex items-end px-4 py-4 bg-gradient-to-b from-[#CFD369] to-[#7D812E] rounded-3xl">
        {detailLink && (
          <Link
            href={detailLink}
            className="px-2 py-3 max-w-[35%] flex gap-3 items-center justify-between bg-[#C2C65F] border border-[#424309] rounded-tl-lg rounded-tr-3xl rounded-bl-2xl rounded-br-lg hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-[#323207] text-3xl xl:text-4xl">
              Click Here to view more details
            </h2>
            <div className="max-w-[40px] max-h-[40px] xl:max-w-[52px] xl:max-h-[52px] bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 -rotate-90 text-8xl">
              <svg
                className="w-full h-full text-[#424309] transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>

      <div className="z-10 w-1/2 pt-24 mb-28">
        <div className="flex flex-col gap-y-2 xl:gap-y-4 text-[#233259] bg-white pl-5 pr-12 py-3 rounded-3xl shadow-lg font-(family-name:--font-ubuntu)">
          {overviewTitle && (
            <h3 className="text-center text-2xl xl:text-4xl font-bold">
              {overviewTitle}
            </h3>
          )}
          <p
            className="text-base lg:text-xl xl:text-2xl leading-9 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: overviewDescription,
            }}
          />
        </div>
      </div>
      <div className="relative w-1/2 -ml-10 pb-20 z-20">
        <h1 className="absolute top-0 left-0 text-white text-6xl w-full h-32 bg-gradient-to-b from-[#000000] to-[#00000000] rounded-t-3xl px-4 py-3">
          {imageTitle}
        </h1>
        <Image
          src={imageUrl || "/little_boy_dentist.jpg"}
          alt="Card Image"
          width={500}
          height={500}
          className="w-full h-full rounded-3xl shadow-lg object-cover"
          priority
        />
      </div>
    </div>
  );
};

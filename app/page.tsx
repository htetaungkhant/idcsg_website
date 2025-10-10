import { HomePageBtn } from "@/components/CustomButtons";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { HomepageSettingsService } from "@/lib/services/homepage-settings-service";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60; // instant updates (0 seconds delay), Dynamic rendering on every request

export default async function Home() {
  // Fetch homepage settings from the backend
  const homepageSettings = await HomepageSettingsService.getActiveSettings();

  // Determine background type and styling
  const hasMediaBackground =
    homepageSettings?.backgroundMediaUrl &&
    homepageSettings?.backgroundMediaType;

  return (
    <div className="relative">
      {/* Render media background (image or video) */}
      {hasMediaBackground ? (
        <>
          {homepageSettings.backgroundMediaType === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            >
              <source
                src={homepageSettings.backgroundMediaUrl!}
                type="video/mp4"
              />
            </video>
          ) : (
            <div
              className="absolute top-0 left-0 w-full h-full object-cover -z-10 bg-cover bg-center"
              style={{
                backgroundImage: `url(${homepageSettings.backgroundMediaUrl})`,
              }}
            />
          )}
        </>
      ) : (
        /* Fallback to default video if no media background is available */
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        >
          <source src="/dummy-data/main_bg.mp4" type="video/mp4" />
        </video>
      )}

      <div className="max-h-screen h-screen overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="h-full flex flex-col">
          <Header />

          <section className="mt-28 flex-1 flex flex-col gap-10 lg:gap-18 items-center justify-center">
            <h1 className="text-white text-center text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-(family-name:--font-oswald) font-bold">
              International Dental Centre
            </h1>

            <div className="flex gap-6 lg:gap-10 items-center max-md:flex-col">
              <HomePageBtn>WhatsApp to Book</HomePageBtn>
              {/* <HomePageBtn>Pay Online</HomePageBtn> */}
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}

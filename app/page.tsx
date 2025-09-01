import { HomePageBtn } from "@/components/CustomButtons";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="relative">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/dummy-data/main_bg.mp4" type="video/mp4" />
      </video>

      <div className="max-h-screen overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="h-screen flex flex-col">
          <Header />

          <section className="flex-1 flex flex-col gap-10 lg:gap-18 items-center justify-center">
            <h1 className="text-white text-center text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-(family-name:--font-oswald) font-bold">
              International Dental Centre
            </h1>

            <div className="flex gap-6 lg:gap-10 items-center">
              <HomePageBtn>Book Appointment</HomePageBtn>
              <HomePageBtn>Online Consultation</HomePageBtn>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}

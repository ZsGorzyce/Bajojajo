import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-20">
          <SectionTitle
            title="Pokédex"
            paragraph="Our application provides an intelligent, interactive Pokédex where you can explore Pokémon stats, abilities, evolutions, and types, all curated and powered by the latest AI technology."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 font-bold text-violet-300 opacity-[0.9]">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Features;

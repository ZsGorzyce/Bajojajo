const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""} text-4xl text-violet-100 font-semibold`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <h2 className="mb-4 text-3xl font-semibold !leading-tight text-violet-100 sm:text-4xl md:text-[45px]">
          <span className="active">{title}</span> powered by AI
        </h2>
        <p className="text-base !leading-relaxed font-medium text-violet-300 opacity-[0.9] ">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;

interface SectionTitleProps {
  text: string;
}

const SectionTitle = ({ text }: SectionTitleProps) => {
  const words = text.split(" ");
  const lastWord = words[words.length - 1];
  const leadingText = words.slice(0, -1).join(" ");

  return (
    <h2 className="font-['Inter'] font-semibold text-[35px] leading-[42px] tracking-[0.014em] text-[#121212] relative inline-block">
      {leadingText}{" "}
      <span className="relative">
        <span
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, #FAFAFA 29.7%, rgba(247,147,26,0.4) 100%)",
          }}
        />
        {lastWord}
      </span>
    </h2>
  );
};

export default SectionTitle;

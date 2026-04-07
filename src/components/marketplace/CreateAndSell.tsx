import { Settings, Store, FolderOpen, ArrowLeftRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

interface Step {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: Settings,
    iconColor: "#A3C23D",
    title: "Setup Your Inventory",
    description:
      "Bring all your collectibles into one organized space where you can easily manage, track, and update each item as your inventory grows over time.",
  },
  {
    id: 2,
    icon: Store,
    iconColor: "#3D96C2",
    title: "Create Your Storefront",
    description:
      "Set up a storefront that lets you present your items, making it easy for anyone to browse, understand, and explore what you have available",
  },
  {
    id: 3,
    icon: FolderOpen,
    iconColor: "#6842F1",
    title: "Add Your Collection",
    description:
      "Add your cards and collectibles, keeping everything properly categorized so your collection stays easy to navigate and simple to manage at any scale.",
  },
  {
    id: 4,
    icon: ArrowLeftRight,
    iconColor: "#F18F42",
    title: "List Them For Sale",
    description:
      "Choose your prices, review your items, and publish your listings when you're ready, giving you full control over when and how your collectibles go on sale",
  },
];

const CreateAndSell = () => {
  return (
    <section className="bg-[#fafafa] px-[96px] py-16">
      <div className="flex justify-center mb-10">
        <SectionTitle text="Create And Sell Your Collection" />
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-[1248px] mx-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="max-w-[612px] flex-1 h-[186px] bg-white rounded-[16px] px-6 py-2.5 flex flex-row gap-6 items-start"
            >
              <div className="w-[60px] h-[60px] flex items-center justify-center flex-shrink-0 mt-2">
                <Icon className="w-[60px] h-[60px]" style={{ color: step.iconColor }} />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-['Inter'] font-semibold text-[24px] text-[#121212]">
                  {step.title}
                </h3>
                <p className="font-['Inter'] font-normal text-[16px] text-[rgba(18,18,18,0.6)] leading-[19px]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CreateAndSell;

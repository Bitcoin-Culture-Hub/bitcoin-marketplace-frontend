import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const series = [
  "Series 1 OPP",
  "Series 2 OPP", 
  "Series 3 OPP",
  "Series 4 OPP",
  "Commemorative",
  "Collaborative",
  "Commemorative Whale",
];

const years = ["2022", "2023", "2024", "2025", "2026"];

const certifications = ["PSA", "BGS", "SGC", "TAG"];

const grades = ["10", "9.5", "9", "8.5", "8", "7", "6", "Other"];

const FilterSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
      {title}
    </h3>
    {children}
  </div>
);

const FilterSidebar = () => {
  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground">
          Filters
        </span>
        <Button 
          variant="link" 
          className="text-[10px] text-muted-foreground hover:text-foreground p-0 h-auto uppercase tracking-wider"
        >
          Reset All
        </Button>
      </div>

      {/* Series */}
      <FilterSection title="Series">
        <div className="space-y-2.5">
          {series.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year">
        <div className="space-y-2.5">
          {years.map((year) => (
            <label key={year} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {year}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Certification */}
      <FilterSection title="Certification">
        <div className="space-y-2.5">
          {certifications.map((cert) => (
            <label key={cert} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                {cert}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Grade */}
      <FilterSection title="Grade">
        <div className="space-y-2.5">
          {grades.map((grade) => (
            <label key={grade} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {grade}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex gap-2">
          <Input 
            placeholder="Min" 
            className="bg-background border-border text-xs h-8 rounded-none"
          />
          <Input 
            placeholder="Max" 
            className="bg-background border-border text-xs h-8 rounded-none"
          />
        </div>
      </FilterSection>

      {/* Signed */}
      <FilterSection title="Signed">
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              Yes
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              No
            </span>
          </label>
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;

import { PaletteIcon, CheckIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button 
        tabIndex={0} 
        className="btn btn-ghost btn-circle relative hover:bg-primary/10 transition-all duration-200 group"
        title="Change Theme"
      >
        <PaletteIcon className="size-5 text-base-content/70 group-hover:text-primary transition-colors duration-200" />
        <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-3 p-2 shadow-2xl bg-base-100/95 backdrop-blur-lg rounded-2xl
        w-64 border border-base-300/50 max-h-80 overflow-y-auto z-50"
      >
        <div className="p-2">
          <h3 className="text-sm font-semibold text-base-content mb-3 px-2">Choose Theme</h3>
          <div className="space-y-1">
            {THEMES.map((themeOption) => {
              const isActive = theme === themeOption.name;
              
              return (
                <button
                  key={themeOption.name}
                  className={`
                    w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary/15 text-primary shadow-sm border border-primary/20"
                        : "hover:bg-base-200/50 text-base-content/80 hover:text-base-content"
                    }
                  `}
                  onClick={() => setTheme(themeOption.name)}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-primary/20" 
                      : "bg-base-200/50 group-hover:bg-primary/10"
                  }`}>
                    <PaletteIcon className="size-4" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium">{themeOption.label}</span>
                  </div>
                  
                  {/* THEME PREVIEW COLORS */}
                  <div className="flex gap-1 items-center">
                    <div className="flex gap-0.5">
                      {themeOption.colors.map((color, i) => (
                        <span
                          key={i}
                          className="size-3 rounded-full border border-base-300/30 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {isActive && (
                      <CheckIcon className="size-4 text-primary ml-2 animate-in slide-in-from-right-2 duration-200" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;
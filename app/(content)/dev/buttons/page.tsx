import Button from "@/components/button/button.component";
import {
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from "@/components/button/button.types";

const ButtonsPage = () => {
  return (
    <div className="centralized-x" style={{ marginTop: "100px" }}>
      {Object.values(ButtonColor).map((color) => (
        <div key={color} className="centralized-y">
          {Object.values(ButtonStyle).map((style) => (
            <div key={style} className="centralized-y">
              {Object.values(ButtonSize).map((size) => (
                <div key={size} className="centralized-x">
                  {Object.values([false, true]).map((disabled) => {
                    return (
                      <Button
                        key={`${disabled}`}
                        style={style}
                        color={color}
                        size={size}
                        disabled={disabled}
                      >
                        Test button
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ButtonsPage;

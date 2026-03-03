import { Shape } from "@/redux/slices/shapes";
import { Arrow } from "./arrow";
import { Stroke } from "./stroke";
import { Rectangle } from "./rectangle";
import { Frame } from "./frame";
import { Elipse } from "./elipse";
import { Line } from "./line";
import { Text } from "./text";
import GeneratedUI from "./generatedui";

interface Props {
  shape: Shape;
  toggleInspiration: () => void;
  toggleChat: (generatedUIId: string) => void;
  generateWorkflow: (generatedUIId: string) => void;
  exportDesign: (generatedUIId: string, element: HTMLElement | null) => void;
}

const ShapeRenderer = ({
  shape,
  toggleInspiration,
  toggleChat,
  generateWorkflow,
  exportDesign,
}: Props) => {
  switch (shape.type) {
    case "frame":
      return <Frame shape={shape} toggleInspiration={toggleInspiration} />;
    case "rect":
      return <Rectangle shape={shape} />;
    case "ellipse":
      return <Elipse shape={shape} />;
    case "freedraw":
      return <Stroke shape={shape} />;
    case "arrow":
      return <Arrow shape={shape} />;
    case "line":
      return <Line shape={shape} />;
    case "text":
      return <Text shape={shape} />;
    case "generatedui":
      return (
        <GeneratedUI
          shape={shape}
          toggleChat={toggleChat}
          generateWorkflow={generateWorkflow}
          exportDesign={exportDesign}
        />
      );
    default:
      return null;
  }
};

export default ShapeRenderer;

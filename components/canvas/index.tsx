"use client";
import {
  useGlobalChat,
  useInfiniteCanvas,
  useInspiration,
} from "@/hooks/use-canvas";
import TextSidebar from "./text-sidebar";
import { cn } from "@/lib/utils";
import ShapeRenderer from "./shapes";
import { RectanglePreview } from "./shapes/rectangle/preview";
import { FramePreview } from "./shapes/frame/preview";
import { ElipsePreview } from "./shapes/elipse/preview";
import { LinePreview } from "./shapes/line/preview";
import { FreeDrawStrokePreview } from "./shapes/stroke/preview";
import { ArrowPreview } from "./shapes/arrow/preview";
import { SelectionOverlay } from "./shapes/selection";
import { InspirationSidebar } from "./shapes/inspiration-sidebar";
import { ChatWindow } from "./shapes/generatedui/chat";

const InfiniteCanvas = () => {
  const {
    viewport,
    shapes,
    currentTool,
    selectedShapes,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    attachCanvasRef,
    getDraftShape,
    getFreeDrawPoints,
    isSidebarOpen,
    hasSelectedText,
  } = useInfiniteCanvas();
  const draftShape = getDraftShape();
  const freeDrawPoints = getFreeDrawPoints();
  const { isInspirationOpen, closeInspiration, toggleInspiration } =
    useInspiration();

  const {
    isChatOpen,
    activeGeneratedUID,
    closeChat,
    toggleChat,
    generateWorkflow,
    exportDesign,
  } = useGlobalChat();
  return (
    <>
      <InspirationSidebar
        isOpen={isInspirationOpen}
        onClose={closeInspiration}
      />
      <TextSidebar isOpen={isSidebarOpen && hasSelectedText} />
      {/* {activeGeneratedUID && ( */}
        <ChatWindow
          generatedUID={activeGeneratedUID}
          isOpen={isChatOpen}
          onClose={closeChat}
        />
      {/* )} */}
      <div
        ref={attachCanvasRef}
        id="application"
        aria-label="Infinite drawing canvas"
        className={cn(
          "relative w-full h-full overflow-hidden select-none z-0 bg-black",
          {
            "cursor-grabbing": viewport.mode === "panning",
            "cursor-grab": viewport.mode === "shiftPanning",
            "cursor-crosshair":
              currentTool !== "select" && viewport.mode === "idle",
            "cursor-default":
              currentTool === "select" && viewport.mode === "idle",
          },
        )}
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      >
        <div
          className="absolute origin-top-left pointer-events-none z-10"
          style={{
            transform: `translate3d(${viewport.translate.x}px, ${viewport.translate.y}px, 0) scale(${viewport.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              toggleInspiration={toggleInspiration}
              shape={shape}
              toggleChat={toggleChat}
              generateWorkflow={generateWorkflow}
              exportDesign={exportDesign}
            />
          ))}
          {shapes.map((shape) => (
            <SelectionOverlay
              key={`selection-${shape.id}`}
              shape={shape}
              isSelected={!!selectedShapes[shape.id]}
            />
          ))}
          {draftShape && draftShape.type === "frame" && (
            <FramePreview
              startWorld={draftShape.startWorld}
              currentWorld={draftShape.currentWorld}
            />
          )}
          {draftShape && draftShape.type === "rect" && (
            <RectanglePreview
              startWorld={draftShape.startWorld}
              currentWorld={draftShape.currentWorld}
            />
          )}
          {draftShape && draftShape.type === "ellipse" && (
            <ElipsePreview
              startWorld={draftShape.startWorld}
              currentWorld={draftShape.currentWorld}
            />
          )}
          {draftShape && draftShape.type === "line" && (
            <LinePreview
              startWorld={draftShape.startWorld}
              currentWorld={draftShape.currentWorld}
            />
          )}
          {draftShape && draftShape.type === "arrow" && (
            <ArrowPreview
              startWorld={draftShape.startWorld}
              currentWorld={draftShape.currentWorld}
            />
          )}
          {currentTool === "freedraw" && freeDrawPoints.length > 1 && (
            <FreeDrawStrokePreview points={freeDrawPoints} />
          )}
        </div>
      </div>
    </>
  );
};

export default InfiniteCanvas;

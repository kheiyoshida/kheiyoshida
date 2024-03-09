import { MakeRender } from ".";
import { RenderSignal } from "../events/messages";
import { Vision } from "./vision";

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.Go]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.TurnRight]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.TurnLeft]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.GoDownStairs]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.ProceedToNextFloor]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.OpenMap]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  },
  [RenderSignal.CloseMap]: function (vision: Vision): () => void {
    throw new Error("Function not implemented.");
  }
}
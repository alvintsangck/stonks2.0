import { CallHistoryMethodAction } from "connected-react-router";
import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";
import { ThemeAction } from "../theme/action";

export type RootAction = AuthAction | ThemeAction | CallHistoryMethodAction;

export type RootDisPatch = Dispatch<RootAction>;

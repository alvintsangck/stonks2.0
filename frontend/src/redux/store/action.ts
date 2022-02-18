import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";

export type RootAction = AuthAction

export type RootDisPatch = Dispatch<RootAction>;
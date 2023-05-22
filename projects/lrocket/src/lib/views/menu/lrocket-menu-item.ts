import { LRocketSubMenuItem } from "./lrocket-sub-menu-item";

export interface LRocketMenuItem extends LRocketSubMenuItem {
    children?: LRocketSubMenuItem[];
}
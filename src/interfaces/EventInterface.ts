import GroupInterface from "./GroupInterface.ts";
import UserInterface from "./UserInterface.ts";

export default interface EventInterface {
    id: number,
    title: string,
    description: string,
    start_time: string,
    visibility: number,
    group: GroupInterface,
    creator: UserInterface,
    user_status: number | undefined
}
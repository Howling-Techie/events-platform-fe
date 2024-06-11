import GroupInterface from "./GroupInterface.ts";
import UserInterface from "./UserInterface.ts";

export default interface EventInterface {
    id: number,
    title: string,
    description: string,
    start_time: string,
    location: string | undefined,
    visibility: number,
    group: GroupInterface,
    creator: UserInterface,
    status: { status: number, paid: boolean, amount_paid: number } | undefined,
    google_link: string | undefined,
    price: number,
    pay_what_you_want: boolean
}
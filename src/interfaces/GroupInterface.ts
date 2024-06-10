import UserInterface from "./UserInterface.ts";

export default interface GroupInterface {
    id: number,
    name: string,
    about: string,
    avatar: string | undefined,
    visibility: number,
    owner: UserInterface,
    user_access_level: number | undefined
}
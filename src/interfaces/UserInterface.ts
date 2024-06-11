export default interface UserInterface {
    id: number,
    username: string,
    display_name: string,
    email: string | undefined,
    avatar: string | undefined,
    about: string | undefined,
    contact: { note: string, friends: boolean } | undefined
}

export interface GroupUserInterface {
    user: UserInterface;
    user_access: number;
}

export interface EventUserInterface {
    user: UserInterface;
    status: { status: number, paid: boolean, amount_paid: number }
}
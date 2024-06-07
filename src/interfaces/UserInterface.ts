export default interface UserInterface {
    id: number,
    username: string,
    display_name: string,
    email: string | undefined,
    avatar: string | undefined,
    about: string | undefined,
    contact: { note: string, friends: boolean } | undefined
}

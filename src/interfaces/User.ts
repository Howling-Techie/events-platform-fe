export default interface User {
    id: number,
    username: string,
    display_name: string,
    email: string | undefined,
    avatar: string | undefined,
    about: string | undefined
}

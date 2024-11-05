export default function IsEmail(field: string) {
    const regx = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
    return regx.test(field)
}

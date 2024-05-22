export function base64(str: string): string {
    return btoa(str);
    //return Buffer.from(str).toString('base64')
}
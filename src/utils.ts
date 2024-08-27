import { BASE_LINKROOM_TALK } from "./config";

export function base64(str: string): string {
    return btoa(str);
    //return Buffer.from(str).toString('base64')
}

export function getLinkRoom(token: string): string {
    return `${BASE_LINKROOM_TALK}/index.php/call/${token}`
}
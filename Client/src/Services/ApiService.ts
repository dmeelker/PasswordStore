import * as Model from "../Model/Model";
import Config from "../config";

let token: string | null = null;

export class Entry {
    public id: string = "";
    public name: string = "";
    public url: string = "";
    public username: string = "";
    public password: string = "";
}

export class Group {
    public id: string = "";
    public name: string = "";
    public entries: Entry[] = [];
    public groups: Group[] = [];
}

export class Document {
    public version: number = 1;
    public root: Group = new Group();
}

export async function login(username: string, password: string): Promise<void> {
    let options: RequestInit = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username, 
            password: password
        }),
    };

    let request = new Request(Config.API_URL + '/auth', options);
    let response = await fetch(request);

    if(response.ok) {
        const tokenResponse = await response.json();
        token = tokenResponse.token;
        return;
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

export async function getPasswords(): Promise<Document | null> {
    let response = await authenticatedGet('/repository');

    if(response.ok) {
        return await response.json();
    } else if(response.status === 404) {
        return null;
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

export async function savePasswords(userId: string, document: Document): Promise<boolean> {
    let response = await authenticatedPost('/repository', document);

    if(response.ok) {
        await response.text();
        return true;
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

function authenticatedGet(url: string): Promise<Response> {
    let options: RequestInit = {
        method: 'get',
        headers: {
            "auth-token": token as string
        }
    };
    let request = new Request(Config.API_URL + url, options);
    return fetch(request);
}

function authenticatedPost(url: string, body: any): Promise<Response> {
    let options: RequestInit = {
        method: 'post',
        headers: {
            "auth-token": token as string
        },
        body: JSON.stringify(body)
    };
    let request = new Request(Config.API_URL + url, options);
    return fetch(request);
}
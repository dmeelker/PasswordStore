import * as Model from "../Model/Model";
import * as Crypt from "../Utilities/Crypt";
import Config from "../config";

let token: string | null = null;
let encryptionKey: string;

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
    public format: number = 1;
    public version: number = 1;
    public editDate: Date = new Date();
    public root: Group = new Group();
}

class EncryptedDocument {
    public format: number = 1;
    public version: number = 1;
    public editDate: Date = new Date();
    public ciphertext: string = "";
    public iv: string = "";
    public salt: string = "";
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
        encryptionKey = Crypt.hashKey(password);
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
        const encryptedDocument: EncryptedDocument = await response.json();
        const decryptedRepository = Crypt.decrypt(encryptedDocument, encryptionKey);
        const document = new Document();
        document.format = encryptedDocument.format;
        document.version = encryptedDocument.version;
        document.editDate = encryptedDocument.editDate;
        document.root = JSON.parse(decryptedRepository);

        return document;
    } else if(response.status === 404) {
        return null;
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

export async function savePasswords(document: Document): Promise<boolean> {
    const encryptedRepository = Crypt.encrypt(JSON.stringify(document.root), encryptionKey);
    const finalDocument = new EncryptedDocument();
    finalDocument.format = document.format;
    finalDocument.version = document.version;
    finalDocument.ciphertext = encryptedRepository.ciphertext;
    finalDocument.iv = encryptedRepository.iv;
    finalDocument.salt = encryptedRepository.salt;

    let response = await authenticatedPost('/repository', finalDocument);

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
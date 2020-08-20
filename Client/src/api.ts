const baseUrl = "http://localhost:5000";

export async function loadRepository() : Promise<Document> {
    let options: RequestInit = {method: 'get'};
    let request = new Request(baseUrl + '/repository?username=test', options);
    let response = await fetch(request);

    if(response.ok) {
        return await response.json() as Document;
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

export async function saveRepository(data: Document) {
    let options: RequestInit = {
        method: 'post',
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        body: JSON.stringify(data),
    };

    let request = new Request(baseUrl + '/repository?username=test', options);
    let response = await fetch(request);

    if(response.ok) {
        return await response.json();
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}

export class Document {
    public Format: string;
    public Entries: Entry[] = [];
}

export class Entry {
    public Type: string;
    public Name: string;
    public Password: string;
    public Children: Entry[] = [];
}
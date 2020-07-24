const baseUrl = "http://localhost:5000";

export async function loadRepository() : Promise<any> {
    let options: RequestInit = {method: 'get'};
    let request = new Request(baseUrl + '/repository?username=test', options);
    let response = await fetch(request);

    if(response.ok) {
        return await response.json();
    } else {
        throw new Error(`Error loading data: ${response.statusText}`);
    }
}
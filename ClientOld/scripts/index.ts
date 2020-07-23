import "../styles/test.less"
import * as other from "./other";
import * as model from "./model/model";

console.log('Hello!');
other.sayHello();

loadData();

async function loadData() {
    let options: RequestInit = {method: 'get'}; //, mode: 'cors'};
    //let request = new Request('http://localhost:5000/repository?username=test', options);
    let request = new Request('http://localhost:5000/repository?username=test', options);
    let response = await fetch(request);
    if(response.ok) {
        var content = await response.json();
        console.log(content);

        let x = new model.Group("Item");
        x.children.push(new model.PasswordEntry("stuff"));
        x.children.push(new model.Group("stuff2"));

    } else {
        console.log('Fetch Error :-S', response.statusText);
    }
    // fetch(request)
    //     .then(
    //         function(response) {
    //         if (response.status !== 200) {
    //             console.log('Looks like there was a problem. Status Code: ' +
    //             response.status);
    //             return;
    //         }
    
    //         // Examine the text in the response
    //         response.json().then(function(data) {
    //             console.log(data);
    //         });
    //         }
    //     )
    //     .catch(function(err) {
    //         console.log('Fetch Error :-S', err);
    //     });
}
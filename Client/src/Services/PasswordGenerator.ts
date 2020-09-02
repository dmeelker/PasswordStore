import { randomWord } from "./EnglishWords";

export interface Settings {
    minLength: number;
};

export function generateRandomPassword(settings: Settings): string {
    const availableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i=0; i<settings.minLength; i++) {
        password = password + availableCharacters[random(0, availableCharacters.length)];
    }

    return password;
}

export function generateRandomWords(minLength: number): string {
    let password = "";

    while(password.length < minLength) {
        const word = randomWord();
        password = password + word;
    }

    return password;
}

function random(min: number, max: number) {
    const range = max - min;
    return Math.floor(min + (Math.random() * range));
}
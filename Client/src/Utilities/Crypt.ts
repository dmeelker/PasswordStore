import * as CryptoJS from "crypto-js";

var JsonFormatter = {
    stringify: function (cipherParams: any): EncryptedData {
        return {
            ciphertext: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
            iv: cipherParams.iv.toString(),
            salt: cipherParams.salt.toString()
        };
    },
    parse: function (input: EncryptedData): CryptoJS.WordArray {
        return {
            ciphertext: CryptoJS.enc.Base64.parse(input.ciphertext),
            iv: CryptoJS.enc.Hex.parse(input.iv),
            salt: CryptoJS.enc.Hex.parse(input.salt)
        };
    }
};

export interface EncryptedData {
    ciphertext: string;
    iv: string;
    salt: string;
}

export function encrypt(input: string, key: string): EncryptedData {
    return JsonFormatter.stringify(CryptoJS.AES.encrypt(input, key));
}

export function decrypt(input: EncryptedData, key: string): string {
    const bytes = CryptoJS.AES.decrypt(JsonFormatter.parse(input), key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashKey(key: string): string {
    return CryptoJS.SHA1(key).toString();
}
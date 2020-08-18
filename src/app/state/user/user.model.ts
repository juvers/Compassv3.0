export class User {
    _id?: number;
    // tslint:disable-next-line: variable-name
    _id_hide?: boolean;
    isAdmin?: string;
    participantName: string;
    programWave?: number;

    get roles() {
        const role = parseInt(`${this.isAdmin || 0}`, 10);
        return {
            operations: role >= 1,
            administrator: role >= 2,
            developer: role === 3
        };
    }

    constructor(token?: string) {
        if (token) {
            Object.assign(this, this.decodeToken(token));
        }
    }

    private decodeToken(token: string) {
        if (!token) {
            return null;
        }
        const decode = (str: string) => {
            let output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw new Error('Illegal base64url string!');
            }
            // base-64: atob decodes, btoa encodes
            return window.atob(output);
        };

        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        // get payload part of token that contains user data (Token look like xxxxxxxxxxx.yyyy.zzzzzzzzzzzz the y is the encoded payload.)
        const encoded = parts[1];

        // decode user data from payload token
        const decoded = decode(encoded);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded) as User;
    }
}

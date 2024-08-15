import * as crypto from 'crypto';

class Cryptography {
    private algorithm: string;
    private key: Buffer;

    constructor() {
        this.algorithm = 'aes-256-cbc';
        // Load key from environment variable or secure storage
        this.key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
        if (this.key.length !== 32) {
            console.log('Encryption key must be 32 bytes long')
        }
    }

    encrypt(text: string) {
        const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // Include the IV with the encrypted data
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
    }

    decrypt(encryptedData: string, iv: string) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv, 'hex'));
        // Convert encrypted data from hex to Buffer and decrypt
        const encryptedBuffer = Buffer.from(encryptedData, 'hex');
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    }
}

const cryptography = new Cryptography();

export default cryptography;
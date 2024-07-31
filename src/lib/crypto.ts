import * as crypto from 'crypto'

class Cryptography {
    public algorithm
    public key
    public iv
    constructor(){
        this.algorithm = 'aes-256-cbc'
        this.key = crypto.randomBytes(32)
        this.iv = crypto.randomBytes(16);
    }
   encrypt(text) {
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
          encryptedData: encrypted.toString('hex')
        };
      }
    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(this.iv, 'hex'));
        let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

export default new Cryptography()
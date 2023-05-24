import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const crypto = require('crypto');
const AWS = require('aws-sdk');

const ENCRYPT_ALGORITHM = 'aes256';

@Injectable()
export class KmsService {
    private client;

    constructor(private configService: ConfigService) {
        const region = this.configService.get('KMS_REGION');
        this.client = new AWS.KMS({ region });
    }

    private async generateDataKey(keyId: string) {
        const keySpec = 'AES_256';
        const { CiphertextBlob, Plaintext } = await this.client.generateDataKey({ KeyId: keyId, KeySpec: keySpec }).promise();
        return {
            plainText: Plaintext.toString('base64'),
            cipherText: CiphertextBlob.toString('base64'),
        };
    }

    async getPlainTextDataKey(encryptedDataKey: string) {
        const { Plaintext } = await this.client.decrypt({ CiphertextBlob: Buffer.from(encryptedDataKey, 'base64') }).promise();
        return Plaintext.toString('base64');
    }

    async encrypt(plainText: string, keyId: string) {
        const dataKey = await this.generateDataKey(keyId);
        const iv = crypto.randomBytes(16).toString('hex');

        const cipheriv = crypto.createCipheriv(ENCRYPT_ALGORITHM, Buffer.from(dataKey.plainText, 'base64'), Buffer.from(iv, 'hex'));
        let cipherText = cipheriv.update(plainText, 'utf8', 'hex');
        cipherText += cipheriv.final('hex');

        return { cipherText, cipherDataKey: dataKey.cipherText, iv };
    }

    async decrypt(cipherText: string, cipherDataKey: string, iv: string) {
        const dataKeyPlainText = await this.getPlainTextDataKey(cipherDataKey);
        const decipheriv = crypto.createDecipheriv(ENCRYPT_ALGORITHM, Buffer.from(dataKeyPlainText, 'base64'), Buffer.from(iv, 'hex'));
        let plainText = decipheriv.update(cipherText, 'hex', 'utf8');
        plainText += decipheriv.final('utf8');
        return plainText;
    }
}

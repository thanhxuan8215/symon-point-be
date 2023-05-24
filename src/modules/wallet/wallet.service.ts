import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);
    private walletEnpoint: string;

    constructor(private configService: ConfigService) {
        this.walletEnpoint = this.configService.get('WALLET_ENDPOINT');
    }

    async createWallet() {
        try {
            const { data } = await axios.post(`${this.walletEnpoint}/wallets`);

            return data;
        } catch (error) {
            this.logger.error(`createWallet: ${JSON.stringify(error)}`);
            throw new Error(`Create wallet failed.`);
        }
    }

    async getAddressBalance(address: string) {
        try {
            const { data } = await axios.get(`${this.walletEnpoint}/wallets/balance/${address}`);

            return data;
        } catch (error) {
            this.logger.error(`getAddressBalance: ${JSON.stringify(error)}`);
            throw new Error(`Get address balance failed.`);
        }
    }

    async mint(body: {
        amount: number;
        address: string;
        privateKey: string;
    }) {
        try {
            const { data } = await axios.post(`${this.walletEnpoint}/transactions/mint`, body);

            return data;
        } catch (error) {
            this.logger.error(`mint: ${JSON.stringify(error)}`);
            throw new Error(`Mint failed.`);
        }
    }

    async getTransactionByTxid(txid: string) {
        try {
            const { data } = await axios.get(`${this.walletEnpoint}/transactions/${txid}`);

            return data;
        } catch (error) {
            this.logger.error(`getTransactionByTxid: ${JSON.stringify(error)}`);
            throw new Error(`Get transaction by txid: ${txid} failed.`);
        }
    }

    async getLatestBlock() {
        try {
            const { data } = await axios.get(`${this.walletEnpoint}/blocks/latest`);

            return data;
        } catch (error) {
            this.logger.error(`mint: ${JSON.stringify(error)}`);
            throw new Error(`Get latest block failed.`);
        }
    }
}

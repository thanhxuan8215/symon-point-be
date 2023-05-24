import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const qs = require('qs');

@Injectable()
export class SymonPointService {
  private readonly logger = new Logger(SymonPointService.name);
  private pointUrl: string;
  private buser: string;
  private bpwd: string;
  private sid: string;
  private spwd: string;

  constructor(private configService: ConfigService) {
    this.pointUrl = this.configService.get('POINT_ENDPOINT');
    this.buser = this.configService.get('POINT_BUSER');
    this.bpwd = this.configService.get('POINT_BPASSWORD');
    this.sid = this.configService.get('POINT_SID');
    this.spwd = this.configService.get('POINT_SPASSWORD');

  }

  async inquiryPoint(customerId: string) {
    try {
      const authorization = `Basic ${Buffer.from(`${this.buser}:${this.bpwd}`).toString('base64')}`;
      const headers = { authorization };
      const body = qs.stringify({
        sid: this.sid,
        spwd: this.spwd,
        cid: customerId
      });
      const { data } = await axios.post(`${this.pointUrl}/InfoxApi33`, body, { headers });
      const parser = new XMLParser();
      const obj = parser.parse(data);

      return obj.result;
    } catch (error) {
      this.logger.error(`inquiryPoint: ${JSON.stringify(error)}`);
      throw new Error(`Inquiry point failed.`);
    }
  }
}

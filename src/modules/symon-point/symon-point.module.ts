import { Module } from '@nestjs/common';
import { SymonPointService } from './symon-point.service';

@Module({
  providers: [SymonPointService],
  exports: [SymonPointService]
})
export class SymonPointModule { }

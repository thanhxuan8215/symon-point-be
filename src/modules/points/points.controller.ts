import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { ExchangePointDto } from './dto/exchange-point.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GrantPointDto } from './dto/grant-point.dto';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { CancelPointDto } from './dto/cancel-point.dto';
import { SyncPointDto } from './dto/sync-point.dto';
import { GetPointLogsDto } from './dto/get-point-logs';
import { GetTransactionsDto } from './dto/get-transactions';
import { ApiKeyAuthGuard } from 'src/shared/guards/api-key-auth.guard';
import { GetDevicesStatisticalDto } from './dto/get-devices-statistical.dto';
import { GetDeviceStatisticalDto } from './dto/get-device-statistical.dto';
import { GetCustomersStatisticalDto } from './dto/get-customers-statistical.dto';
import { GetCustomerStatisticalDto } from './dto/get-customer-statistical.dto';

@ApiTags('points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  // @Post('/grant')
  // async grantPoint(@Body() grantPointDto: GrantPointDto) {
  //   return this.pointsService.grantPoint(grantPointDto);
  // }

  // @Post('/exchange')
  // async exchangePoint(@Body() exchangePointDto: ExchangePointDto) {
  //   return this.pointsService.exchangePoint(exchangePointDto);
  // }

  // @Post('/cancel')
  // async cancelPoint(@Body() cancelPointDto: CancelPointDto) {
  //   return this.pointsService.cancelPoint(cancelPointDto);
  // }

  // @Get('/get-point/:addressId')
  // async getPoint(@Param('addressId', new ParseUUIDPipe()) addressId: string) {
  //   return this.pointsService.getPoint(addressId);
  // }

  // @Post('/sync')
  // async syncPoint(@Body() syncPointDto: SyncPointDto) {
  //   return await this.pointsService.syncPoint(syncPointDto);
  // }

  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('api-key')
  @Post()
  async createPoint(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.createPoint(createPointDto);
  }

  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('api-key')
  @Put()
  async updatePoint(@Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.updatePoint(updatePointDto);
  }

  @ApiBearerAuth()
  @Get('/logs')
  async getPointLogs(@Query() queries: GetPointLogsDto) {
    return this.pointsService.getPointLogs(queries);
  }

  @ApiBearerAuth()
  @Get('/logs/all')
  async getAllPointLogs() {
    return this.pointsService.getAllPointLogs();
  }

  @ApiBearerAuth()
  @Get('/transactions')
  async getTransactions(@Query() queries: GetTransactionsDto) {
    return this.pointsService.getTransactions(queries);
  }

  @ApiBearerAuth()
  @Get('/transactions/all')
  async getAllTransactions() {
    return this.pointsService.getAllTransactions();
  }

  @ApiBearerAuth()
  @Get('/statistical/devices')
  async getDevicesStatistical(@Query() queries: GetDevicesStatisticalDto) {
    return this.pointsService.getDevicesStatistical(queries);
  }

  @ApiBearerAuth()
  @Get('/statistical/devices/all')
  async getAllDevicesStatistical() {
    return this.pointsService.getAllDevicesStatistical();
  }

  @ApiBearerAuth()
  @Get('/statistical/device')
  async getDeviceStatistical(@Query() queries: GetDeviceStatisticalDto) {
    return this.pointsService.getDeviceStatistical(queries);
  }

  @ApiBearerAuth()
  @Get('/statistical/customers')
  async getCustomersStatistical(@Query() queries: GetCustomersStatisticalDto) {
    return this.pointsService.getCustomersStatistical(queries);
  }

  @ApiBearerAuth()
  @Get('/statistical/customers/all')
  async getAllCustomersStatistical() {
    return this.pointsService.getAllCustomersStatistical();
  }

  @ApiBearerAuth()
  @Get('/statistical/customer/:id')
  async getCustomerStatistical(
    @Param('id') id: string,
    @Query() queries: GetCustomerStatisticalDto,
  ) {
    return this.pointsService.getCustomerStatistical(id, queries);
  }

  // @ApiBearerAuth()
  // @Get('/create-transaction/:fromDate/:toDate/:ignoreIndex')
  // async createTransactionByDate(
  //   @Param('fromDate') fromDate: string,
  //   @Param('toDate') toDate: string,
  //   @Param('ignoreIndex') ignoreIndex: string,
  // ) {
  //   return this.pointsService.createTransactions(fromDate, toDate, ignoreIndex);
  // }
}

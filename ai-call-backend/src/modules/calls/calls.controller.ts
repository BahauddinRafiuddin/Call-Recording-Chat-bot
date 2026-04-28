import { Controller, Delete, Get, Param, Headers } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private callService: CallsService) { }
  @Delete(":id")
  async deleteCall(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.callService.deleteCall(id, userId)
  }

  @Get()
  async getAllCalls() {
    return this.callService.findAll()
  }

}

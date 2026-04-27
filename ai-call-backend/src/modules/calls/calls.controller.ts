import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private callService: CallsService) { }
  @Delete(":id")
  async deleteCall(@Param('id') id: string) {
    return this.callService.deleteCall(id)
  }

  @Get()
    async getAllCalls(){
      return this.callService.findAll()
    }
  
}

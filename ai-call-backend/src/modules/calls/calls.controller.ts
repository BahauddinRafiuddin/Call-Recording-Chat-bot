import { Controller, Delete, Param } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private callService: CallsService) { }
  @Delete(":id")
  async deleteCall(@Param('id') id: string) {
    return this.callService.deleteCall(id)
  }
}

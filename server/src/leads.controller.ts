import { Controller, Get, Query } from '@nestjs/common'
import { LeadService } from './lead.service'

@Controller('leads')
export class LeadsController {
    constructor(
        private readonly leadservice: LeadService
    ) {}

    @Get()
    async getAll(@Query() query: object) {
        return await this.leadservice.getAll(query)
    }
}

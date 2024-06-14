import { Module } from '@nestjs/common'
import { LeadsController } from './leads.controller'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { LeadService } from './lead.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule
    ],
    controllers: [LeadsController],
    providers: [LeadService],
})
export class AppModule {}

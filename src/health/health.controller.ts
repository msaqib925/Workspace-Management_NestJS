import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    ping() {
        return {
            status: 'OK',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
}

import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express'; 
import { join } from 'path';

@Controller()
export class AppController {
    
    @ApiExcludeEndpoint()
    @Get()
    getHomepage(@Res() res: Response) {
        const htmlPath = join(__dirname, '..', 'static', 'index.html');
        res.sendFile(htmlPath);
    }

}
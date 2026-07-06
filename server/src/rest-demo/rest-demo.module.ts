import { Module } from '@nestjs/common';
import { RestDemoController } from './rest-demo.controller';
import { RestDemoService } from './rest-demo.service';

@Module({
  controllers: [RestDemoController],
  providers: [RestDemoService],
})
export class RestDemoModule {}

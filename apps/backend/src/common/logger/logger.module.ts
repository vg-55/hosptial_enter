import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

export class AppLoggerModule {
  static forRoot(): DynamicModule {
    return PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const level = configService.get<string>('logging.level', 'info');
        const pretty = configService.get<boolean>('logging.prettyPrint', false);
        return {
          pinoHttp: {
            level,
            autoLogging: true,
            transport: pretty
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
          },
        };
      },
    });
  }
}

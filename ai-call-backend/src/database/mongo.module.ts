import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        
        connectionFactory: (connection) => {
          console.log("🔥 Mongoose connection readyState:", connection.readyState);

          connection.once('open', () => {
            console.log('✅ MongoDB connected (OPEN)');
          });

          connection.on('error', (err) => {
            console.error('❌ MongoDB error:', err);
          });

          return connection;
        },
      }),
    }),
  ],
})
export class MongoModule { }
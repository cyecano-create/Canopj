import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { positionsModule } from './positions/positions.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, positionsModule ],
})
export class AppModule {}

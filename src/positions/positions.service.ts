// i change here the users to positions and i also inserted in the position the position_code,position_name
//i also put  the position_id in the findby id 

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private readonly db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPositions(position_code: string, position_name: string, userId: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
      [position_code, position_name, userId],
    );

    return {position_id: result.insertId, position_code, position_name, id: userId,
    };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, id, created_at FROM positions',
    );
    return rows;
  }

  async findById(position_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, id, created_at FROM positions WHERE position_id = ?',
      [position_id],
    );
    return rows[0];
  }

  async updatePosition(position_id: number, partial: { position_code?: string; position_name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.position_code) {
      fields.push('position_code = ?');
      values.push(partial.position_code);
    }

    if (partial.position_name) {
      fields.push('position_name = ?');
      values.push(partial.position_name);
    }

    if (!fields.length) return await this.findById(position_id);

    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
    values.push(position_id);

    await this.pool().execute<OkPacket>(sql, values);
    return this.findById(position_id);
  }

  async deletePositions(position_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM positions WHERE position_id = ?',
      [position_id],
    );
    return res.affectedRows > 0;
  }
}

#!/usr/bin/env node
/**
 * 修复数据库表结构
 * 如果表存在但结构不对，会删除旧表并重新创建
 * 
 * 使用方法：
 *   node backend/script/fix-db.cjs
 * 
 * 警告：这会删除所有数据！仅在开发环境或确认可以丢失数据时使用。
 */

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL 环境变量未设置');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('🔍 检查数据库表结构...');

    // 检查 users 表是否有 id 列
    const checkUsers = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
        AND column_name = 'id'
      );
    `);

    if (!checkUsers.rows[0]?.exists) {
      console.log('⚠️  检测到 users 表结构不正确，将删除并重新创建...');
      
      // 删除所有相关表（按依赖顺序）
      await client.query('DROP TABLE IF EXISTS user_sessions CASCADE;');
      await client.query('DROP TABLE IF EXISTS extension_commands CASCADE;');
      await client.query('DROP TABLE IF EXISTS extension_status CASCADE;');
      await client.query('DROP TABLE IF EXISTS prompts CASCADE;');
      await client.query('DROP TABLE IF EXISTS users CASCADE;');
      
      console.log('✅ 已删除旧表');
    } else {
      console.log('✅ users 表结构正确');
    }

    await client.query('COMMIT');
    console.log('✅ 数据库修复完成！请重启应用以重新初始化表结构。');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ 修复失败:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase().catch((err) => {
  console.error('❌ 未预期的错误:', err);
  process.exit(1);
});


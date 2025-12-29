import { pool } from "./db";
import { log } from "./index";

/**
 * 自动初始化数据库表（如果不存在）
 * 在生产环境启动时自动运行
 */
export async function initDatabase(): Promise<void> {
  try {
    // 检查 users 表是否存在
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const tableExists = tableCheck.rows[0]?.exists;
    
    if (tableExists) {
      // 检查表结构是否正确（检查是否有 id 列）
      const columnCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
          AND column_name = 'id'
        );
      `);

      const columnExists = columnCheck.rows[0]?.exists;
      
      if (columnExists) {
        log("数据库表已存在且结构正确，跳过初始化", "init-db");
        return;
      } else {
        // 表存在但结构不正确，需要删除并重建
        log("检测到表结构不正确，将删除旧表并重新创建...", "init-db");
        await pool.query('DROP TABLE IF EXISTS user_sessions CASCADE;');
        await pool.query('DROP TABLE IF EXISTS extension_commands CASCADE;');
        await pool.query('DROP TABLE IF EXISTS extension_status CASCADE;');
        await pool.query('DROP TABLE IF EXISTS prompts CASCADE;');
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');
        log("已删除旧表，开始重新创建...", "init-db");
      }
    } else {
      log("数据库表不存在，开始初始化...", "init-db");
    }

    // 创建 users 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        api_token TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_ingest_at TIMESTAMP,
        CONSTRAINT users_email_uniq UNIQUE (email),
        CONSTRAINT users_token_uniq UNIQUE (api_token)
      );
    `);

    // 创建 prompts 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_ingest_at TIMESTAMP,
        site TEXT NOT NULL,
        page_url TEXT NOT NULL,
        conversation_id TEXT,
        prompt_text TEXT NOT NULL,
        prompt_hash TEXT NOT NULL,
        device_id TEXT NOT NULL DEFAULT 'unknown',
        client_event_id UUID NOT NULL DEFAULT gen_random_uuid(),
        meta JSONB,
        tags TEXT[],
        analysis JSONB,
        is_favorite BOOLEAN DEFAULT FALSE,
        is_synced BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMP,
        CONSTRAINT prompts_device_event_uniq UNIQUE (device_id, client_event_id)
      );
    `);

    // 创建索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS prompts_user_created_idx ON prompts(user_id, created_at);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS prompts_user_site_idx ON prompts(user_id, site);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS prompts_tags_gin_idx ON prompts USING GIN(tags);
    `);

    // 创建 extension_status 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS extension_status (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        device_id TEXT NOT NULL,
        pending INTEGER NOT NULL DEFAULT 0,
        failed INTEGER NOT NULL DEFAULT 0,
        sending INTEGER NOT NULL DEFAULT 0,
        last_request_id TEXT,
        last_sync_at TIMESTAMP,
        last_sync_error TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT ext_status_user_device_uniq UNIQUE (user_id, device_id)
      );
    `);
    
    // 创建 extension_status 索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS ext_status_user_updated_idx ON extension_status(user_id, updated_at);
    `);

    // 创建 extension_commands 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS extension_commands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        device_id TEXT,
        command TEXT NOT NULL,
        payload JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        consumed_at TIMESTAMP
      );
    `);
    
    // 创建 extension_commands 索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS ext_cmd_user_created_idx ON extension_commands(user_id, created_at);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS ext_cmd_user_device_idx ON extension_commands(user_id, device_id);
    `);

    // 创建 user_sessions 表（用于 connect-pg-simple）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        CONSTRAINT user_sessions_pkey PRIMARY KEY (sid)
      );
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS IDX_user_sessions_expire ON user_sessions(expire);
    `);

    log("数据库表初始化完成！", "init-db");
  } catch (err: any) {
    // 如果表已存在或其他错误，记录但不抛出
    if (err?.code === '42P07' || err?.message?.includes('already exists')) {
      log("数据库表已存在，跳过初始化", "init-db");
      return;
    }
    // 如果是列不存在的错误，说明表结构有问题
    if (err?.code === '42703' || err?.message?.includes('does not exist')) {
      log(`数据库表结构错误: ${err?.message || String(err)}。请检查表结构或删除旧表后重新初始化。`, "init-db");
      // 不抛出错误，让应用继续启动，但记录警告
    } else {
      log(`数据库初始化错误: ${err?.message || String(err)}`, "init-db");
    }
    // 不抛出错误，让应用继续启动（表可能已经存在）
  }
}


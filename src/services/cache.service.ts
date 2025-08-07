import { createClient, RedisClientType } from "redis";

export class CacheService {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on("connect", () => {
      console.log("Redis Client Connected");
      this.isConnected = true;
    });

    this.client.on("error", () => {
      // console.error("Redis Client Error", err);
      this.isConnected = false;
    });

    this.client.on("end", () => {
      console.log("Redis Client Disconnected");
      this.isConnected = false;
    });

    // Initialize connection
    this.client.connect().catch((error: unknown) => {
      console.error("Failed to connect to Redis:", error);
      this.isConnected = false;
    });
  }

  async clear(): Promise<void> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping cache clear");
      return;
    }

    try {
      await this.client.flushDb();
    } catch (error) {
      console.error("Redis clear error:", error);
      this.isConnected = false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping cache delete");
      return false;
    }

    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      console.error("Redis delete error:", error);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping disconnect");
      return;
    }

    try {
      await this.client.quit();
      this.isConnected = false;
    } catch (error) {
      console.error("Redis disconnect error:", error);
      this.isConnected = false;
    }
  }

  async get<T>(key: string): Promise<null | T> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping cache get");
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Redis get error:", error);
      this.isConnected = false;
      return null;
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping cache invalidatePattern");
      return;
    }

    try {
      const keys = await this.client.keys(`*${pattern}*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error("Redis invalidatePattern error:", error);
      this.isConnected = false;
    }
  }

  async set(key: string, value: unknown, ttlMs = 300_000): Promise<void> {
    if (!this.isConnected) {
      // console.log("Redis not connected, skipping cache set");
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, Math.floor(ttlMs / 1000), serializedValue);
    } catch (error) {
      console.error("Redis set error:", error);
      this.isConnected = false;
    }
  }
}

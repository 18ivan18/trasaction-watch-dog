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

    this.client.on("error", (err) => {
      // console.error("Redis Client Error", err);
      this.isConnected = false;
    });

    this.client.on("end", () => {
      console.log("Redis Client Disconnected");
      this.isConnected = false;
    });

    // Initialize connection
    this.client.connect().catch((error) => {
      console.error("Failed to connect to Redis:", error);
      this.isConnected = false;
    });
  }

  async set<T>(key: string, value: T, ttlMs: number = 300000): Promise<void> {
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

  async get<T>(key: string): Promise<T | null> {
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

  async getStats(): Promise<{
    size: number;
    keys: string[];
    connected: boolean;
  }> {
    if (!this.isConnected) {
      return { size: 0, keys: [], connected: false };
    }

    try {
      const keys = await this.client.keys("*");
      return {
        size: keys.length,
        keys,
        connected: true,
      };
    } catch (error) {
      console.error("Redis getStats error:", error);
      this.isConnected = false;
      return { size: 0, keys: [], connected: false };
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
}

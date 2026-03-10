import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Robust SportsMonks V3 API Client
 * Includes exponential backoff for 429 Too Many Requests and timeouts to prevent hanging queues.
 */
export class SportsMonksClient {
  private client: AxiosInstance;

  constructor() {
    const apiToken = process.env.SPORTSMONKS_API_TOKEN;
    if (!apiToken) {
      throw new Error('SPORTSMONKS_API_TOKEN is not defined in environment variables');
    }

    this.client = axios.create({
      baseURL: 'https://api.sportmonks.com/v3/football',
      timeout: 5000, // 5 second hard timeout for upstream reliability
      headers: {
        Authorization: apiToken,
        Accept: 'application/json',
      },
    });

    // Axios Interceptor for Exponential Backoff on 429 Rate Limits
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as any;
        if (!config) return Promise.reject(error);

        if (error.response?.status === 429) {
          config._retryCount = config._retryCount || 0;
          
          if (config._retryCount < 3) {
            config._retryCount += 1;
            // Exponential backoff: 1s, 2s, 4s
            const backoffTime = Math.pow(2, config._retryCount - 1) * 1000;
            console.warn(`[SportsMonksClient] Rate limited (429). Retrying in ${backoffTime}ms (Attempt ${config._retryCount}/3)...`);
            
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            return this.client(config);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // ---- V3 Endpoints ----

  async getLatestUpdatedLiveScores(includes: string[] = ['events', 'scores', 'participants']) {
    const includeQuery = includes.join(';');
    // Polled strictly by Live Update Engine (every 10s)
    const response = await this.client.get(`/livescores/latest?include=${includeQuery}`);
    return response.data;
  }

  async getFixturesByDate(date: string, includes: string[] = ['participants', 'league']) {
    const includeQuery = includes.join(';');
    const response = await this.client.get(`/fixtures/date/${date}?include=${includeQuery}`);
    return response.data;
  }

  async getFixtureById(id: number, includes: string[] = ['events', 'statistics', 'lineups', 'standings']) {
    const includeQuery = includes.join(';');
    const response = await this.client.get(`/fixtures/${id}?include=${includeQuery}`);
    return response.data;
  }

  async getLeagues(page: number = 1) {
    const response = await this.client.get(`/leagues?page=${page}`);
    return response.data;
  }
}

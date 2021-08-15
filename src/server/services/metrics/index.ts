import { Request, Response } from 'express';
import client from 'prom-client';
import env from '@app/common/config/env';

client.register.setDefaultLabels({
  service: env.service_name,
  environment: env.app_env
});

client.collectDefaultMetrics();

const histogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'statusCode', 'path']
});

class MetricsService {
  /**
   * HTTP Handler for sending prometheus metrics
   * @param req Express Request object
   * @param res Express response object
   */
  send(req: Request, res: Response) {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
  }

  /**
   * Records a HTTP response
   * @param req Express request object
   * @param res Express response object
   */
  record(req: Request, res: Response) {
    const responseTimeHeader = <string>res.getHeader('X-Response-Time');
    const time = parseFloat(responseTimeHeader) / 1000;
    const url = `${req.baseUrl}${req.route.path}`;
    histogram.labels(req.method, String(res.statusCode), url).observe(time);
  }
}

export default new MetricsService();

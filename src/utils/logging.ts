import * as Koa from 'koa';

interface ILogData {
  method: string;
  url: string;
  query: string;
  remoteAddress: string;
  host: string;
  userAgent: string;
  statusCode: number;
  errorMessage: string;
  errorStack: string;
  data: any;
  responseTime: number;
}

function log (data: Partial<ILogData>, caughtError?: Error) {
  // TODO: configure logging based on env
  console.log(`${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`);
  if (caughtError) {
    console.error(caughtError);
  }
}

export default async function logger (ctx: Koa.Context, next: () => Promise<any>) {
  const start = new Date().getMilliseconds();

  const logData: Partial<ILogData> = {
    method: ctx.method,
    url: ctx.url,
    query: ctx.query,
    remoteAddress: ctx.request.ip,
    host: ctx.headers.host,
    userAgent: ctx.headers['user-agent']
  };

  let error: any;
  try {
    await next();
    logData.statusCode = ctx.status;
  } catch (err) {
    error = err;
    logData.errorMessage = err.message;
    logData.errorStack = err.stack;
    logData.statusCode = err.status || 500;
    if (err.data) {
      logData.data = err.data;
    }

    logData.responseTime = new Date().getMilliseconds() - start;
    log(logData, error);

    if (error) {
      throw error;
    }
  }
}
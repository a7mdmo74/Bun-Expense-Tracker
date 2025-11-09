export function logger(req: Request, startTime: number, response: Response) {
  const duration = Date.now() - startTime;
  const { method, url } = req;
  const { status } = response;

  const timestamp = new Date().toISOString();

  console.log(`${timestamp} ${method} ${url} - ${status} - ${duration}ms`);
}

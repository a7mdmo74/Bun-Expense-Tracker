export function logger(req: Request, startTime: number, response: Response) {
  const duration = Date.now() - startTime;
  const { method, url } = req;
  const { status } = response;

  const timestamp = new Date().toISOString();
  const logColor =
    status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
  const resetColor = "\x1b[0m";

  console.log(
    `${timestamp} ${logColor}${method}${resetColor} ${url} - ${logColor}${status}${resetColor} - ${duration}ms`
  );
}

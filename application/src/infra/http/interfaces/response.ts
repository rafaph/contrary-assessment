import { BAD_REQUEST, NOT_FOUND, OK } from "http-status";

export abstract class Response<Body = unknown> {
  public headers?: Record<string, string>;
  public body?: Body;
  public status!: number;

  public static badRequest<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: BAD_REQUEST,
      body,
    };
  }

  public static ok<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: OK,
      body,
    };
  }

  public static notFound<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: NOT_FOUND,
      body,
    };
  }
}

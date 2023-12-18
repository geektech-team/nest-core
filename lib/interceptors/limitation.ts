import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { ServerExceptionCode } from '../enums/server-exception';
import { Observable } from 'rxjs';
import {
  ServerException,
} from '../models/server-exception';

const REFLECTOR = 'Reflector';
const LimitationMetadata = 'limitation';

/**
 * 限流的配置，可以用这个装饰器来配置限流数量
 * @param max 限流数，默认100
 * @param interval 毫秒数，默认1000
 * @returns
 */
export const Limitation = (max: number, interval: number) =>
  SetMetadata(LimitationMetadata, { max, interval });

@Injectable()
export class LimitationInterceptor implements NestInterceptor {
  private limitValves = new Map<string, LimitValve>();

  constructor(@Inject(REFLECTOR) protected readonly reflector: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = request.route.path;
    let limitValve = this.limitValves.get(key);
    if (!limitValve) {
      const limitation = this.reflector.get(
        LimitationMetadata,
        context.getHandler(),
      );
      limitValve = new LimitValve(limitation?.max, limitation?.interval);
      this.limitValves.set(key, limitValve);
    }
    if (!limitValve.tryPass()) {
      throw new ServerException(
        ServerExceptionCode.CurrentLimitingDowngrading,
        '当前访问量太大，请稍后重试',
      );
    }
    return next.handle();
  }
}

export class LimitValve {
  private preTime: number;
  private volume: number;

  /**
   * 每毫秒恢复速度
   */
  private speed: number;

  constructor(public max: number = 100, public interval: number = 1000) {
    this.preTime = new Date().getTime();
    this.volume = max;
    this.speed = this.max / interval;
  }

  tryPass() {
    const time = new Date().getTime();
    const interval = time - this.preTime;
    this.preTime = time;
    if (interval > this.interval) {
      this.volume = this.max;
      return true;
    }

    // 每过一段时间自动恢复一部分容量
    this.volume += interval * this.speed;
    if (this.volume < 1) {
      return false;
    }
    // 每次请求容量减一
    this.volume -= 1;
    return true;
  }
}

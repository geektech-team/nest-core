# NEST CORE TOOLKIT

## Usage

### Logger

### Cache

在项目的cyy.nest.config.json中配置
```json
{
  "USER_ID_KEY": "USER_ID_KEY"
}
```
否则默认使用 USER_ID_KEY

### Token
在项目的cyy.nest.config.json中配置
```json
{
  "TOKEN_KEY": "TOKEN_KEY"
}
```
否则默认使用 USER_ID_KEY

### Register in main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.useGlobalFilters(app.get(ServerExceptionFilter));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  // 这里要注意添加拦截器顺序，洋葱模型，先添加的会在最外层
  app.useGlobalInterceptors(app.get(PerformanceInterceptor));
  app.useGlobalInterceptors(app.get(LimitationInterceptor));
  app.useGlobalInterceptors(app.get(AuthInterceptor));
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  await app.listen(3001);
}
bootstrap();
```

### Register in app.module.ts

```ts
@Module({
  imports: [
  ],
  exports: [],
  controllers: [],
  providers: [
    HttpExceptionFilter,
    ServerExceptionFilter,
    LimitationInterceptor,
    ResponseInterceptor,
    PerformanceInterceptor,
    CacheInterceptor,
    ValidatorPipe,
  ],
})
```

### Build

```bash
tsc
```

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ApolloService {
  constructor(@Inject('APOLLO_PROVIDER') private readonly apollo) {}

  get(key: string) {
    return this.apollo.get(key);
  }
}

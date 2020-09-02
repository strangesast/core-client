import { NgModule } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { split, ApolloClientOptions } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = '/v1/graphql';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(
        httpLink: HttpLink
      ): ApolloClientOptions<NormalizedCacheObject> {
        const headers = new HttpHeaders();
        headers.append('Accept', 'charset=utf-8');
        const token = localStorage.getItem('token');
        const authorization = token ? `Bearer ${token}` : null;
        headers.append('Authorization', authorization);

        const http = httpLink.create({ uri, headers });

        const ws = new WebSocketLink({
          uri: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
            window.location.host
          }${uri}`,
          options: { reconnect: true },
        });

        const link = split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === 'OperationDefinition' &&
              def.operation === 'subscription'
            );
          },
          ws,
          http
        );

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

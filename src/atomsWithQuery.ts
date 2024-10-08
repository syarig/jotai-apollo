import {
  ApolloClient,
  OperationVariables,
  ApolloQueryResult,
  WatchQueryOptions,
} from '@apollo/client'
import { Getter, WritableAtom } from 'jotai/vanilla'
import { clientAtom } from './clientAtom'
import { createAtoms } from './common'

type QueryArgs<
  Variables extends object = OperationVariables,
  Data = any
> = WatchQueryOptions<Variables, Data>

type AtomWithQueryAction = {
  type: 'refetch'
}

export const atomsWithQuery = <
  Data,
  Variables extends object = OperationVariables
>(
  getArgs: (get: Getter) => QueryArgs<Variables, Data>,
  getClient: (get: Getter) => ApolloClient<any> = (get) => get(clientAtom)
): readonly [
  dataAtom: WritableAtom<Data | Promise<Data>, [AtomWithQueryAction], void>,
  statusAtom: WritableAtom<ApolloQueryResult<Data>, [AtomWithQueryAction], void>
] => {
  return createAtoms(
    getArgs,
    getClient,
    (client, args) => client.watchQuery(args),
    (action: AtomWithQueryAction, _client, refresh) => {
      if (action.type === 'refetch') {
        refresh()
        return
      }
    }
  )
}

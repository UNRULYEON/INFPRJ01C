import React from 'react'
import { gql } from 'apollo-boost'
import { Query, Mutation } from 'react-apollo'
import { adopt } from 'react-adopt'

const QUERY_FAV = gql`
  query WishlistSelect($userId: Int!) {
    wishlistSelect(userId: $userId){
      id
      gebruikerid
      timestamp
      items
    }
  }
`

const queryFavorite = ({ render }) => (
<Query
  query={QUERY_FAV}
>
  {(query, result) => render({ query, result })}
</Query>)

const INSERT_FAV = gql`
mutation rentalListInsert($gebruikerId: Int!, $items: [PaintRefRent!], $purchaseDate: String!){
  rentalListInsert(gebruikerId: $gebruikerId, items: $items, purchaseDate: $purchaseDate)
}
`

const insertFavorite = ({ render }) => (
<Mutation
  mutation={INSERT_FAV}
>
  {(mutation, result) => render({ mutation, result })}
</Mutation>)

export const FavoriteQueryComposer = adopt({
  queryFavorite,
  insertFavorite,
})

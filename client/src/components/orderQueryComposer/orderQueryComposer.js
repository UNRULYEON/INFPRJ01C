import React from 'react'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'
import { adopt } from 'react-adopt'

const INSERT_ORDER = gql`
  mutation orderListInsert(
    $gebruikerId: Int,
    $items: [PaintRef!],
    $purchaseDate: String!){
      orderListInsert(gebruikerId: $gebruikerId,
                      items: $items,
                      purchaseDate: $purchaseDate)
  }
`

const insertOrder = ({ render }) => (
<Mutation
  mutation={INSERT_ORDER}
>
  {(mutation, result) => render({ mutation, result })}
</Mutation>)

const INSERT_RENTAL = gql`
mutation rentalListInsert($gebruikerId: Int!, $items: [PaintRefRent!], $purchaseDate: String!){
  rentalListInsert(gebruikerId: $gebruikerId, items: $items, purchaseDate: $purchaseDate)
}
`

const insertRental = ({ render }) => (
<Mutation
  mutation={INSERT_RENTAL}
>
  {(mutation, result) => render({ mutation, result })}
</Mutation>)

export const OrderQueryComposer = adopt({
  insertOrder,
  insertRental,
})

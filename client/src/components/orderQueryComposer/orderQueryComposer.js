import React from 'react'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'
import { adopt } from 'react-adopt'

const INSERT_ORDER = gql`
mutation orderListInsert($buyerId: Int, $items: [PaintRef!], $date: String!, $total: Int!){
  orderListInsert(buyerId: $buyerId, items: $items, date: $date, total: $total)
}
`

const insertOrder = ({ render }) => (
<Mutation
  mutation={INSERT_ORDER}
>
  {(mutation, result) => render({ mutation, result })}
</Mutation>)

const INSERT_RENTAL = gql`
mutation rentalListInsert($buyerId: Int!, $items: [PaintRefRent!], $date: String!, $total: Int!){
  rentalListInsert(buyerId: $buyerId, items: $items, date: $date, total: $total)
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

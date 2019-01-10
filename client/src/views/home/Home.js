import React, { Component } from 'react';

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/gallery/Gallery'
// import HeroFeatured from '../../components/herofeatured/HeroFeatured'

const GET_ART = gql`
  {
    collection {
      id_number
      title
      src
      width
      height
      price
    }
  }
`;

const homeVisit = gql`
  mutation homevisit{
    homeVisit
  }
`;

// const GET_FEATURED = gql`
//   {
//     featured {
//       maker
//       image {
//         width
//         height
//       }
//     }
//   }
// `;



class Home extends Component {


  render() {
    return (
      <div>



        <section className="section-container">
          <PageTitle title="Herfst" subtitle="De stijl van de dag" />
          <Query query={GET_ART}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <Gallery images={data.collection} />
              )
            }}
          </Query>
        </section>
        {/* <section>
        <Query query={GET_ART}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <HeroFeatured featured={data.collection}/>
              )
            }}
          </Query>
        </section> */}
        <section className="section-container">
          <PageTitle title="Vind je favoriete schilderij ❤️" subtitle="Iets voor jou?" />
          <Query query={GET_ART}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <Gallery images={data.collection} />
              )
            }}
          </Query>
        </section>
      </div>
    );
  }
}

export default Home;

// export default function Home() {
//   return (
//     <Mutation
//       mutation={homeVisit}
//     >
//       {(login, { loading, error }) => {
//         if (loading) return <p>Loading...</p>;
//         if (error) return <p>Error :(</p>;
//         console.log("not loading and no error")
//         return (
//           <Home login={login}>
//           </Home>
//         )
//       }}
//     </Mutation>
//   )
// };

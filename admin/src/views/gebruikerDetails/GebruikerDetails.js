import React, { Component } from 'react';
import './GebruikerDetails.css';

// const GET_PAINTER_DETAILS = gql`
//   query Painter($id: String!){
//     painterByID(id: $id){
//       name
//       headerimage
//       description
//     }
//   }
// ` 

class GebruikerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      surname: '',
      mail: '',
      password: '',
      aanhef: '',
      adres: '',
      housenumber: '',
      city: '',
      postalcode: '',
      paymentmethod: '',
    }
  }

  componentDidMount() {
    console.log(`Gebruiker ID: ${this.props.match.params.id}`)
    this.setState({
      id: this.props.match.params.id,
    })
  }

  render() {
    return (
      <section className="section-container">
      Gebruiker: {this.state.id}
        <div className="stepper-content-container">
        <form className="order-form-details">
          <div className="order-form-details-column" id="order-form-details-column-lables">
            <div className="order-form-details-row-label">
              <p>Aanhef</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Naam</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Email</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Straat en huisnummer</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Postcode</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Stad</p>
            </div>
          </div>
           
        </form>
      </div>
        

      </section>
    );
  }
}

export default GebruikerDetails;

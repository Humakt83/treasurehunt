import React from 'react';

const rows = 10;
const columns = 10;

export default class Board extends React.Component {

  constructMap() {
    const table = [];
    for (let y = 0; y < rows; y++) {      
      for (let x = 0; x < columns; x++) {
        table.push(<div className="tile" key={'' + x + y}>{y},{x}</div>);
      }
    }
    return table;
  }

  render() {
    return (
      <section>
        <div className="level">
          {this.constructMap()}
        </div>
      </section>
    )
  }
};

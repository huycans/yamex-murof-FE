import React, { Component } from "react"
import PropTypes from "prop-types"

const Pagination = ({current, pages, loadOnClick }) => {
  // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
  let paginationNumbers = []
  
  current == 1 
  ? paginationNumbers.push(<li className="disabled"><button disabled>First</button></li>) 
  : paginationNumbers.push(<li><button onClick={() => {loadOnClick(1)}}>First</button></li>)
  
  var i = Number(current) > 5 ? Number(current) - 4 : 1
  
  if(i !== 1) paginationNumbers.push(<li className="disabled"> <button disabled>...</button></li>)
  
  for (; i <= Number(current) + 4 && i <= pages; i++) {
    // trick to make sure ii has the value of i per run, not the final value of i
    let ii = i;
    if (i == current) {
      paginationNumbers.push(
        <li className="active">
          <button className="pagination active">{ii}</button>
        </li>
      )
    } else {
      paginationNumbers.push(
        <li>
          <button onClick={() => {
            loadOnClick(ii)
          }} >{i}</button>
        </li>
      )
    }
    if (i == Number(current) + 4 && i < pages) {
      paginationNumbers.push(
        <li className="disabled">
          <button disabled>...</button>
        </li>
      )
    }
  }
  
  if (current == pages)  {
    paginationNumbers.push(
    <li className="disabled">
      <button disabled >Last</button>
    </li>
  )} 
  else {
    paginationNumbers.push(
    <li>
      <button onClick={() => {
        loadOnClick(pages)
      }}>Last</button>
    </li>
  )}
  
  // if there are more than one page, we show pagination
  if (pages > 0) {
    return (
      <ul className="no_pages">
          {
            paginationNumbers
          }
      </ul>
    )
  }
  else return null;
}

Pagination.propTypes = {
  current: PropTypes.number, 
  pages: PropTypes.number, 
  loadOnClick: PropTypes.func
}

export default Pagination
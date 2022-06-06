import React, { useEffect, useState} from 'react';
import Airtable from 'airtable';
import Output from './Output';
import Unrented from './Unrented';
import "../css/Homepage.css"

const base = new Airtable({ apiKey: "keygPg9K1po9kl05J"}).base("app4DDi8QkS37RPQ5");

function Homepage() {
  const [searchedRecords, setsearchedRecords] = useState([]); // Searched Items
  const [userInput, setuserInput] = useState(""); // User input stored here
  const [captureDelete, setcaptureDelete] = useState(false); // Flag for detecting delete or backspace
  const allRecords = []; // Const for storing all imported records from both pages

  

  // Run this function as soon as the document is loaded on the screen
  // Filter the user input and populate the page accordingly
  useEffect(() => {
    base('Inventory').select({ 
      filterByFormula: 
      `OR(SEARCH(LOWER("${userInput}"), LOWER({CustodianFirst})) > 0, 
      SEARCH(LOWER("${userInput}"), LOWER({CustodianLast})) > 0, 
      SEARCH(LOWER("${userInput}"), LOWER({Item})) > 0, 
      SEARCH(LOWER("${userInput}"), LOWER({EquipmentType})) > 0 )`, 
      sort: [{field: 'Tag', direction: 'asc'}]
  })
    .eachPage((records, fetchNextPage) => {
      records.forEach(function(record){
        allRecords.push(record);
      });
      fetchNextPage(); // 
      setsearchedRecords(allRecords); 
    });
  }, [userInput]);
  

  // Handle the submit the button
  function handleSubmit() {
    if(userInput.length < 2){
      alert("Please type at least two characters.");
    }else{
    setcaptureDelete(true);
    }
  }

  // Detect backspace key or delete key
  function handleDelete(e) {
    if (e.key === "Delete" || e.key === "Backspace"){
      setcaptureDelete(false);
    }
  }


  // Capture user input
  function handleChange(event) {
    setuserInput(event.target.value);
  }
  
  return (
  <div>
    <div>
      <div>
        <label 
        style={{display: "block", marginTop:"50px"}}
        >Search by First or Last Name
        </label>
        <input
        onKeyDown={(e) => handleDelete(e)}
        required="required" 
        type="text" 
        name="fname" 
        onChange={handleChange}/>
      </div>
      <button className="hoverButton" type="button" onClick={handleSubmit}>Send</button>
      { captureDelete ? searchedRecords.map(record =>
          <Output
          key={record.fields.Tag}
          data={record}
          />) : null }
        <div>
          <Unrented />
        </div>
    </div>
  </div>
  );
}

export default Homepage;

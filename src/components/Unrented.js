import React, { useEffect, useState} from 'react';
import Airtable, { Record } from 'airtable';
import Ouput from './Output';
import "../css/Homepage.css"


const base = new Airtable({ apiKey: "keygPg9K1po9kl05J"}).base("app4DDi8QkS37RPQ5");


function Unrented() {
    const [unRented, setunRented] = useState([]); // Unrented Items
    const [unRentFlag, setUnrentFlag] = useState(false); // State variable for unrented items
    const allUnrentedRecords = []; // Const for storing all unrented records from both pages


    useEffect(() => {
        base('Inventory').select({ filterByFormula: `OR(
        {CustodianFirst} = "", 
        {CustodianLast} = "" )`,
        sort: [{field: 'Tag', direction: 'asc'}]
    })
        .eachPage((records, fetchNextPage) => {
          records.forEach(function(record){
            allUnrentedRecords.push(record);
          });
          fetchNextPage();
          setunRented(allUnrentedRecords);
        });
        
      }, []);


    // Determine the unrented output
    function handleUnrented() {
        setUnrentFlag(!unRentFlag);
    }

    return(
        <div>
            <button className='hoverButton' onClick={handleUnrented} style={{ marginTop: "200px" }}>
                Display Unrented Items</button>
            { unRentFlag ? unRented.map(record =>
                <Ouput
                    key={record.fields.Tag}
                    data={record}
                />) : null}
        </div>
    )
}

export default Unrented;
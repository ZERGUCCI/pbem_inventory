import React, { useEffect, useState } from "react";
import emailjs from 'emailjs-com';
import Popup from "react-modal";
import Airtable, { Record } from "airtable";
import "../css/output.css";

const base = new Airtable({ apiKey: "keygPg9K1po9kl05J" }).base(
    "app4DDi8QkS37RPQ5"
);

Popup.setAppElement("#root");
function Output({ data }) {
    const [popupIsOpenForYesOption, setpopupIsOpenForYesOption] = useState(false);
    const [popupIsOpenForNoOption, setpopupIsOpenForNoOption] = useState(false);
    const [userInput, setuserInput] = useState("");
    const [correspondingRecordToRowCustodianName, setCorrespondingRecordToRowCustodianName] = useState("");
    const [IDError, setIDError] = useState("");
    const [IDConfirmed, setIDConfirmed] = useState("");


    useEffect(() => {
        base("ID")
            .select({ filterByFormula: `AND(Lower("${data.fields.CustodianFirst}") = Lower({FirstName}), 
            Lower("${data.fields.CustodianLast}") = Lower({LastName}))` })
            .eachPage((records, fetchNextPage) => {
                records.forEach(function (record) {
                    setCorrespondingRecordToRowCustodianName(record);
                });
                fetchNextPage();
            });
    }, [userInput]);

    function getIDInput(event) {
        setuserInput(event.target.value);
    }

    // Handle the submit the button
    function handleIDSubmit() {
        var date = new Date();
        if (userInput.length < 2) {
            alert("Please type at least two characters.");
        }
        else {
            if (idMatches()) {
                console.log(data);
                base('Inventory').update([
                    {
                        "id": `${data.id}`,
                        "fields": {
                            "LastConfirm": `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
                        }
                    }
                ])
                setIDConfirmed("Your record has been updated!");
                setTimeout(() => {
                    setpopupIsOpenForYesOption(!popupIsOpenForYesOption);
                  }, 3000);
            }else {
                console.log("Nothing Changes");
                setIDError("ID Doesn't match with our records");
            }
        }
    }

    function idMatches() {
        if (correspondingRecordToRowCustodianName.fields == null || correspondingRecordToRowCustodianName.fields.ID == null){
            return false;
        }
        return (correspondingRecordToRowCustodianName.fields.ID == userInput)
    }

    function sendEmail(e) {
        e.preventDefault();

    emailjs.sendForm('service_26foxuq', 'template_16fmt6f', e.target, 'user_UFhBjZTsQT4ul4b238UHr')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }

    return (
        <div>
            <Popup
                isOpen={popupIsOpenForYesOption}
                onRequestClose={() => setpopupIsOpenForYesOption(false)}
                className="popup"
            >

                <h1>Confirm you DO have the item</h1>
        
                <label style = {{textAlign: "center", marginTop: "50px"}}>Please enter your unique ID</label>

                <input
                    required="required"
                    type="text"
                    name="fname"
                    onChange={getIDInput}
                />
        
                <h4 style={{color:"red"}}>{IDError}</h4>
                <h4 style={{color:"green"}}>{IDConfirmed}</h4>
                <button type="button" onClick={handleIDSubmit}>Submit</button>
                <button onClick={() => setpopupIsOpenForYesOption(!popupIsOpenForYesOption)}> Close </button>
            </Popup>
            <Popup
                isOpen={popupIsOpenForNoOption}
                onRequestClose={() => setpopupIsOpenForNoOption(false)}
                className = "popup"
            >
                <h1> Confirm You DONT Have Item <br></br>(sends email to Glenn) </h1>
                <form onSubmit={sendEmail}>
                    <div className = "inputs">
                        <div>
                            <input type="text" placeholder="Name" name="name" defaultValue={data.fields.CustodianFirst}/>
                        </div>
                        <div>
                            <input type="email" placeholder="Email Address" name="email" defaultValue="your email"/>
                        </div>
                        <div>
                            <input type="text" placeholder="Subject" name="subject" value="Item confirmation" readOnly/>
                        </div>
                        <div>
                            <textarea cols="30" rows="8" placeholder="Your message" name="message" defaultValue="I don't have the item"></textarea>
                        </div>
                        <div>
                            <input type="text" placeholder="Item" name="item" value={data.fields.Item} readOnly/>
                        </div>
                        <div>
                            <button type="submit" value="Send Message">Send</button>
                        </div>
                    </div>
                </form>
            </Popup>
            <table
                className="table"
            >
                <thead>
                    <tr>
                        <th>Tag Number</th>
                        <th>Rented Item</th>
                        <th>Equipment Type</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Distributed Date</th>
                        <th>Last Confirmed</th>
                        <th>Due Date</th>
                        <th className={data.fields.CustodianFirst ? "show" : "dontShow"}>
                            Confirmation
            </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.fields.Tag}</td>
                        <td>{data.fields.Item}</td>
                        <td>{data.fields.EquipmentType}</td>
                        <td>{data.fields.CustodianFirst}</td>
                        <td>{data.fields.CustodianLast}</td>
                        <td>{data.fields.DistDate}</td>
                        <td>{data.fields.LastConfirm}</td>
                        <td>{data.fields.DueDate}</td>
                        <td className={data.fields.CustodianFirst ? "show" : "dontShow"}>
                            <div className="dropdown">
                                <button className="dropbtn">Confirm</button>
                                <div className="dropdown-content">
                                    <a href="#" onClick={() => setpopupIsOpenForYesOption(!popupIsOpenForYesOption)}>
                                        Yes
                                        </a>
                                    <a href="#" onClick={() => setpopupIsOpenForNoOption(!popupIsOpenForNoOption)}>No</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Output;

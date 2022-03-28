import React, { useState } from 'react';
import './Market.css';

const Name = ["One", "Two", "Three", "Four", "Five", "Six", "Seven?", "Eight!", "Zero"];
const Price = [1, 2, 3, 4, 5, 6, 7, 8, 0];



function CardUI()
{     
    var card = '';
    var search = '';
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    const[NameArray, setNameArray] = useState([]);
    const[PriceArray, setPriceArray] = useState([]);

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const app_name = 'cop4331-testingwow'
    function buildPath(route){
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else {        
            return 'http://localhost:5000/' + route;
        }
    }

    const addCard = async event => 
    {
    event.preventDefault();
        var obj = {userId:userId,card:card.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('api/addcard'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);
            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Card has been added');
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }
    };
    const searchCard = async event => 
    {
        event.preventDefault();
        
        var obj = {userId:userId,search:search.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('api/searchcards'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);
            var _results = res.results;
            var resultText = '';
            var linebreak = "\n";
            for( var i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                if( i < _results.length - 1 )
                {
                    resultText += ' ';
                }
                if( (i+1)%4 == 0 )
                {
                    resultText += linebreak;
                }
            }
            setResults('Card(s) have been retrieved');
            setCardList(resultText);
            setNameArray(_results);
        }
        catch(e)
        {
            alert(e.toString());
            setResults(e.toString());
        }
    };
    function PlacingTest() {
      const length = NameArray.length;
    
    
    
      function FormattedBoxesone(index) {
        const[Switch, setSwitch] = useState(false);
        return(
          <div>
            <div class = "box" onClick = {() => setSwitch(true)}>
              <p>Name: {NameArray[index]}</p>
              <p>Price: {PriceArray[index]}</p>
            </div>
            <div className = {Switch ? "popupclass" : "hidden"} onClick={() => setSwitch(false)}>
              <p>Name: {NameArray[index]}</p>
              <p>Price: {PriceArray[index]}</p>
            </div>
          </div>
        );
      }
    
    
      var rowone = [];
      let numloop = (length/4);
      var boxes = [];
      let boxloops = 4;
      if(length % 4 !== 0) {
        numloop = (length/4)-1;
      }
    
      for (var i = 0; i < numloop; i++) {
        for (var j = 0; j < boxloops; j++) {
          boxes.push(FormattedBoxesone(i*4+j));
        }
      }
      for (var k = 0; k < length%4; k++) {
        boxes.push(FormattedBoxesone(i*4+k));
      }
      rowone.push(boxes);
     
    
    
      return ( 
        <div class = "container">
          {rowone}
        </div>
      );
    
    }
    
    return(
        <div id="cardUIDiv">
        <div class="navbar">
            <input type="text" id="searchText" placeholder="Searching..." 
            ref={(c) => search = c} />
            <button type="button" id="searchCardButton" class="submit" 
            onClick={searchCard}> Search</button>
        </div>
        <PlacingTest/>
        <br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{}</p><br /><br />
        
        <input type="text" id="cardText" placeholder="Card To Add" 
          ref={(c) => card = c} />
        <button type="button" id="addCardButton" class="buttons" 
          onClick={addCard}> Add Card </button><br />
        <span id="cardAddResult">{message}</span>
        
      </div>
    );
}
export default CardUI;
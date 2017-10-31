const searchController = {};
const path = require('path');

searchController.home = (req, res)=>{
    console.log('searchController.home')
    //res.sendFile( path.join(__dirname , '../static/search.html') );
    
}

searchController.searchBar = (req, res)=>{
    console.log('searchController.searchBar')
    res.sendFile( path.join(__dirname , '../static/searchBar.html') );
    
}

searchController.results = (req, res)=>{
    console.log('searchController.results');
    const fetch = require('node-fetch');
    let query=req.body.searchBar;
    //console.log("query:",query);
    fetch("http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=216072&t.k=gnFZ3pppFCq&action=employers&q="+query+"&userip=67.245.145.191&useragent=Mozilla").then(  function (response){
          //"http://api.glassdoor.com/api/api.htm?t.p=216072&t.k=n07aR34Lk3Y&userip=67.245.145.191&useragent=Mozilla&format=json&v=1&action=jobs-stats&returnStates=true&admLevelRequested=1"
        //c(response.json())
    
        return response.json();
      }).then( function(data){
        //console.log(data);
        //update the containter
        //console.log("this works", data)
        
        
        res.send( data );
      }).catch(function(data){
        console.log( data);
        //res.send( data );
      } );
    

    //res.send( req.body );
    //res.sendFile( path.join(__dirname , '../static/results.html') );
    
}


// searchController.addItem = (req, res)=>{
//     res.sendFile('../static/additem.html');
// }
// searchController.login = (req, res)=>{
//     res.sendFile('../static/login.html');
// }

module.exports = searchController;
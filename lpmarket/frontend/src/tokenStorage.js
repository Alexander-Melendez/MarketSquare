exports.storeToken = function ( tok )
{
    try
    {
      // localStorage.setItem('token_data', tok.accessToken);
      localStorage.setItem('token_data', tok);
    }
    catch(e)
    {
      console.log("STORING: " + e.message);
    }
}
exports.retrieveToken = function ()
{
    var ud;
    try
    {
      ud = localStorage.getItem('token_data');
    }
    catch(e)
    {
      console.log("RETRIEVING: " + e.message);
    }
    return ud;
}
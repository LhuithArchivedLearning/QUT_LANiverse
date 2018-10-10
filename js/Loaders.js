var LoadTextResource = function(url, callback)
{
    var request = new XMLHttpRequest();
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function()
    {
        if(request.status < 200 || request.status > 299)
            {
                callback('Something Blew Up :' + request.status + 'on resource' + url)
            }
            else
            {
                callback(null, request.responseText);
            }
    };

    request.send();
};

   function GenerateFalloffMap(size)
    {
        var map = new Array();

        var a = parseFloat(1);
        var b = parseFloat(5.2);

        for(var i = 0; i < size; i++)
        {
            map[i] = new Array();

            for(var j = 0; j < size; j++)
            {
                var x = (i / parseFloat(size)) * 2 - 1;
                var y = (j / parseFloat(size)) * 2 - 1;

                var value =  parseFloat(Math.max(Math.abs(x), Math.abs(y)));

                map[i][j] = Math.pow(value, a) / (Math.pow(value, a) + Math.pow(b - (b * value), a));
            }
        }
       
        return map;
    }

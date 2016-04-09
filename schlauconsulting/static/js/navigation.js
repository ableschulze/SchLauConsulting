function NavClick($scope, click, split, typ){
    if(click > 0 && click <= split)
        if(typ == 0)
            $scope.tn_actual = click
        else
            $scope.wa_actual = click
}
function GetRange(start, navItem, split) {
    step = 1;
    var ende = start + navItem

    if(start > Math.floor(navItem / 2))
    {
        if(start < split - Math.floor(navItem / 2))
        {
            start = start - Math.floor(navItem / 2)
            ende = start + Math.floor(navItem / 2) * 2
        }
        else
        {
            start = start - Math.floor(navItem / 2)
            ende = split
        }
    }
    else
    {
        ende = ende - start
        start = 1
    }

    var input = [];
    for (var i = start; i <= ende; i += step)
    {
        if(start < split & i <= split)
            input.push(i);
    }

    return input;
}
function ShowNavSpecial(actual, pager, split) {
    if(actual <= split - Math.ceil(pager / 2))
    {
        return true
    }
    else
    {
        return false
    }
}
var SortFunctionByKey = function($scope, array, key) {
    var desc = 0
    if($scope.orderby.col == key)
    {
        if($scope.orderby.desc == 0)
        {
            $scope.orderby.desc = 1
            desc = 1
        }
        else
        {
            $scope.orderby.desc = 0
        }
    }
    else
    {
        $scope.orderby.col = key
        $scope.orderby.desc = 0
    }

    return array.sort(function(a, b)
    {
        var x = a[key];
        var y = b[key];
        if(!isNaN(a[key]) && !isNaN(b[key]))
        {
            if(desc == 0)
            {
                return ((Number(x) < Number(y)) ? -1 : ((Number(x) > Number(y)) ? 1 : 0));
            }
            else
            {
                return ((Number(x) > Number(y)) ? -1 : ((Number(x) < Number(y)) ? 1 : 0));
            }
        }
        else
        {
            if(desc == 0)
            {
                return ((x < y) ? -1 : (x > y) ? 1 : 0);
            }
            else
            {
                return ((x > y) ? -1 : (x < y) ? 1 : 0);
            }
        }
    });
}
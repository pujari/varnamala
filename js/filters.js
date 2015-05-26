/* Filters */
app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input, decimals) + '%';
    };
}]);
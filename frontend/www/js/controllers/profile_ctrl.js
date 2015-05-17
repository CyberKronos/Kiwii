(function() {
    var ProfileCtrl = function($scope) {
        $scope.favouritesList = [
            {title: 'Vij\'s', rating: 8, category: 'Indian', image: 'https://irs0.4sqi.net/img/general/width960/rSyrlfuOIneyVMzihStGP5iYGBAcDv8sqc5vpa2qPsA.jpg'},
            {title: 'Chambar', rating: 9.5, category: 'Restaurant', image: 'https://irs0.4sqi.net/img/general/width960/34995420_-w6_v1KWUtilq5Tem-VHV-M3-PXnFxFz2GooQA5g0UU.jpg'},
            {title: 'Faubourg Bistro', rating: 7.8, category: 'Cafe', image: 'https://irs0.4sqi.net/img/general/width960/C83zIrAX6Obwo7WN6CznE0CXkLfAFk9FhoRkq3V7OZw.jpg'},
            {title: 'Le Marché St. George', rating: 9.8, category: 'Cafe', image: 'https://irs2.4sqi.net/img/general/width960/8vim2slvDNthYIZYfeRXLVK7Ka0elGHBblDKAwpdn6c.jpg'}
        ];

        $scope.removeRestaurant = function(index) {
            $scope.favouritesList.splice(index, 1);
        };
    };

    angular.module('app')
        .controller('ProfileCtrl', ProfileCtrl)
})();

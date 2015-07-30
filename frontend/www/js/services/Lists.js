(function () {
  var Lists = function () {

    var LISTS_CLASS = 'Lists';

    var LISTS_ATTRIBUTE = 'lists';

    /* Public Interface */
    return {
      saveList: function (listData) {
        var List = Parse.Object.extend(LISTS_CLASS);

        var saveList = new List();
        saveList.set('name', listData.name);
        saveList.set('description', listData.description);

        return saveList.save()
          .then(function () {
            var saveListRelation = Parse.User.current().relation(LISTS_ATTRIBUTE);
            saveListRelation.add(saveList);
            
            return Parse.User.current().save();
          });
      },
    };
  };

  angular.module('kiwii')
    .factory('Lists', Lists);
})();
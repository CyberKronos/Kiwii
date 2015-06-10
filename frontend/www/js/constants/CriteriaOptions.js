'use strict';

angular.module('kiwii')
.constant('CRITERIA_OPTIONS', {
    'DISTANCE_LABELS' : [
      {text: 'Off the Beaten Path', minDistance: 15000, icon: 'ion-android-compass'},
      {text: 'Driving Distance', minDistance: 8000, icon: 'ion-android-car'},
      {text: 'Biking Distance', minDistance: 4000, icon: 'ion-android-bicycle'},
      {text: 'Walking Distance', minDistance: 2000, icon: 'ion-android-walk'},
      {text: 'Within a Few Blocks', minDistance: 0, icon: 'ion-android-pin'}
    ],
    'CUISINE_TYPES': [
      { type: 'All Cuisines', name: '', id: '' },
      { type: 'American', name: 'American Restaurant', id: '4bf58dd8d48988d14e941735' },
      { type: 'Asian', name: 'Asian Restaurant', id: '4bf58dd8d48988d142941735' },
      { type: 'Bakery', name: 'Bakery', id: '4bf58dd8d48988d16a941735' },
      { type: 'Bistro', name: 'Bistro', id: '52e81612bcbc57f1066b79f1' },
      { type: 'Breakfast Spots', name: 'Breakfast Spots', id: '4bf58dd8d48988d143941735' },
      { type: 'Burger Joint', name: 'Burger Joint', id: '4bf58dd8d48988d16c941735' },
      { type: 'Cafe', name: 'Cafe', id: '4bf58dd8d48988d16d941735' },
      { type: 'Chinese', name: 'Chinese Restaurant', id: '4bf58dd8d48988d145941735' },
      { type: 'French', name: 'French Restaurant', id: '4bf58dd8d48988d10c941735' },
      { type: 'Greek', name: 'Greek Restaurant', id: '4bf58dd8d48988d10e941735' },
      { type: 'Indian', name: 'Indian Restaurant', id: '4bf58dd8d48988d10f941735' },
      { type: 'Italian', name: 'Italian Restaurant', id: '4bf58dd8d48988d110941735' },
      { type: 'Japanese', name: 'Japanese Restaurant', id: '4bf58dd8d48988d111941735' },
      { type: 'Korean', name: 'Korean Restaurant', id: '4bf58dd8d48988d113941735' },
      { type: 'Malaysian', name: 'Malaysian Restaurant', id: '4bf58dd8d48988d156941735' },
      { type: 'Mexican', name: 'Mexican Restaurant Restaurant', id: '4bf58dd8d48988d1c1941735' },
      { type: 'Middle Eastern', name: 'Middle Eastern Restaurant', id: '4bf58dd8d48988d115941735' },
      { type: 'Seafood', name: 'Seafood Restaurant', id: '4bf58dd8d48988d1ce941735' },
      { type: 'Southern / Soul', name: 'Southern / Soul Food Restaurant', id: '4bf58dd8d48988d14f941735' },
      { type: 'Spanish', name: 'Spanish Restaurant', id: '4bf58dd8d48988d150941735' },
      { type: 'Turkish', name: 'Turkish Restaurant', id: '4f04af1f2fb6e1c99f3db0bb' },
      { type: 'Vegetarian / Vegan', name: 'Vegetarian / Vegan Restaurant', id: '4bf58dd8d48988d1d3941735' },
      { type: 'Vietnamese', name: 'Vietnamese Restaurant', id: '4bf58dd8d48988d14a941735' }
    ],
    'PRICES' : [
      {text: '$', value: '1'},
      {text: '$$', value: '2'},
      {text: '$$$', value: '3'},
      {text: '$$$$', value: '4'}
    ]
  });
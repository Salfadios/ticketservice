var cat = Backbone.Model.extend({
	defaults:
	{
		id: 0,
		name: 'cat',
		mhg: 'll'
	}
});

var cats = Backbone.Collection.extend(
{
	model: cat,
	url: 'http://localhost:3000/cats.json'
});	

var catView = Backbone.View.extend(
{
	initialize: function()
	{
		var catss = new cats();
		catss.fetch();
		console.log(catss);
	}
});

var c = new catView();



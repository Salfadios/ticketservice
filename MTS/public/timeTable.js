window.onload = function()
{
	var work_day = Backbone.Model.extend(
	{
		defaults: 
		{
			doctor_FIO : '',
			time_line : 15,
			time : '[ { "day" : "Sun", "from" : "00:00", "to" : "23:00"},'+
				 '{ "day" : "Mon", "from" : "00:00", "to" : "23:00"},'+
				 '{ "day" : "Tue", "from" : "08:00", "to" : "18:00"},'+
				 '{ "day" : "Wed", "from" : "00:00", "to" : "23:00"},'+
				 '{ "day" : "Thu", "from" : "00:00", "to" : "23:00"},'+
				 '{ "day" : "Fri", "from" : "00:00", "to" : "23:00"},'+
				 '{ "day" : "Sat", "from" : "00:00", "to" : "23:00"}]',
			time_work : 0,
			div : '<div>k</div>',
			colspan : 4
		}
	});      
    var day_time = new work_day(); 
    var view_work_day = Backbone.View.extend(
	{
		el : $('#table_head'),
		el1 : $('#table_time'),
		template_head: _.template($("#table_head_template").html()),
		template_td : _.template($("#table_td_template").html()),
		initialize: function()
		{
			_.bindAll(this, 'render'); 
			this.render();      
		},
		getDayWeek : function()
		{
			var day = new Date();
			return day.getDay();
		},
		getColspan : function()
		{
			var time_line = day_time.get('time_line');
			var count = 60/time_line;
			return count;
		},		
		render : function()
		{
			week = JSON.parse(day_time.get('time'));	 
			var day_week = this.getDayWeek();
			var from = week[day_week].from.split(':');
			var to = week[day_week].to.split(':');
			var count_ticket = this.getColspan();
			day_time.set('colspan', day_time.get('colspan')/count_ticket);
			while(from[0]<=to[0])
			{
				day_time.set('time_work', from[0]+':'+from[1]);
				$(this.el).append(this.template_head(day_time.toJSON()));
				for(i = 0; i<count_ticket; i++)
					$(this.el1).append(this.template_td(day_time.toJSON()));
				from[0]++;
			}
		}
	});
	
	
	var listView = new view_work_day();
	

}
$(function(){
	//Models
	var Ticket = Backbone.Model.extend({
		defaults:{
			ticket_number: 0,
			user: "none",
			address: "none",
			doctor: "none",
			date: "none",
			time: "none",
			coord_x: 0,
			coord_y: 0
		}
	}),
	
	Doctor = Backbone.Model.extend({
		defaults:{
			id: 0,
			full_name: "none",
			specialization: "none",
			duration: 30
		}
	}),
	
	WorkDay = Backbone.Model.extend(
	{
		defaults: 
		{
			doctor_full_name : 'Assanov S.O.',
			time :  '[{ "day" : "Son", "from" : "0:00", "to" : "0:00"},'+
					'{ "day" : "Mon", "from" : "13:00", "to" : "17:00"},'+
					'{ "day" : "Tue", "from" : "13:00", "to" : "18:00"},'+
					'{ "day" : "Wed", "from" : "8:00", "to" : "12:00"},'+
					'{ "day" : "Thu", "from" : "8:00", "to" : "12:00"},'+
					'{ "day" : "Fri", "from" : "13:00", "to" : "17:00"},'+
					'{ "day" : "Sat", "from" : "0:00", "to" : "0:00"}]',
			time_work : 0,
			colspan : 4, 
			id : 'id'
		}
	}),
	
	//Collections
	TicketCollection = Backbone.Collection.extend({
		model: Ticket,
		url: "/tickets"
	}),
	DoctorCollection = Backbone.Collection.extend({
		model: Doctor,
		url: "/doctors"
	}),
	WorkDayCollection = Backbone.Collection.extend({
		model: WorkDay,
		url: "/work_days"
	}),
	WorkWeek = new WorkDayCollection,
	Board = new TicketCollection,
	
	//Views
	TicketView = Backbone.View.extend({
		template: _.template($("#ticket-tamplate").html()),
		events: {
			"click .ticket":"stop",
			"dblclick .ticket":"clear"
		},
		clear: function(){
			this.$el.empty();
			this.model.destroy();
		},
		stop: function(){
			return false;
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			//$(".time_line").append(this.el);
			return this;
		}
	}),
	TicketViewSmall = Backbone.View.extend({
		template: _.template($("#ticket-tamplate-small").html()),
		events: {
			"click .ticket-small":"stop",
			"dblclick .ticket-small":"deleteTicket"
		},
		stop: function(){
			return false;
		},
		deleteTicket: function(){
			this.model.destroy();
		},
		render: function(id){
			this.$el.html(this.template(this.model.toJSON()));
		    $(id).append(this.el);
			return this;
		}
	}),
	DoctorView = Backbone.View.extend({
		template: _.template($("#doctor-tamplate").html()),
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			$(".app").append(this.el);
			return this;
		}
	}),
	day_time = new WorkDay,
	doctor = new Doctor,
	WorkDayView = Backbone.View.extend(
	{
		el : $('#table_head'),
		el1 : $('#table_time'),
		template_head: _.template($("#table_head_template").html()),
		template_td : _.template($("#table_td_template").html()),
		initialize: function()
		{
			Board.fetch();
			WorkWeek.fetch();
			WorkWeek.on("reset", this.show, this);
			_.bindAll(this, 'render');
			this.render();  
		},
		show: function(){
			console.log(WorkWeek.models);
			day_time = WorkWeek.models[0];
			this.render();
		},
		getDayWeek : function()
		{
			var day = new Date();
			return day.getDay();
		},
		getColspan : function()
		{
			var duration = doctor.get('duration');
			var count = 60/duration;
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
			while(from[0] <= to[0])
			{
				day_time.set('time_work', from[0] + ':' + from[1]);
				$(this.el).append(this.template_head(day_time.toJSON()));
				for(i = 0; i < count_ticket; i++)
				{
					if(i==0)
						day_time.set('id', from[0]+''+i*60/count_ticket+'0');
					else
						day_time.set('id', from[0]+''+i*60/count_ticket);
					$(this.el1).append(this.template_td(day_time.toJSON()));
				}
				from[0]++;
			}
		}
	}),
	
	StickerCollectionView = Backbone.View.extend({
		el: "body",
		events: {
			"click .time_line":"addOne"
		},
		initialize: function(){
			var ListView = new WorkDayView();
			Board.on("all", this.render, this);
			Board.fetch();
		},
		addOne: function(e){
			Board.create({
				ticket_number: counter++,
				user: "Nochovniy A.",
				address: "Yunih Lenintsev 22/115",
				doctor: "Assanov S.",
				date: "22.11.2012",
				time: "15:00",
				coord_x: e.clientX - 110,
				coord_y: e.clientY - 100
			});
		},
		render:function(){
			var view, sticker, i, max = Board.models.length;
			for (i = 0; i < max; i++)
			{
				sticker = Board.models[i];
				view = new TicketViewSmall({model:sticker});
				var time = view.model.get('time').split(':');
				var id = '#'+time[0]+''+time[1];
				this.$(id).empty();
				view.render(id);
				
			}
		}
	}),
	counter = 1,
	AppView = new StickerCollectionView;
});